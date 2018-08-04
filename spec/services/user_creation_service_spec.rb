require "rails_helper"

RSpec.describe UserCreationService do
  describe ".create_user" do
    let(:first_name) { "Brutus" }
    let(:last_name) { "Buckeye" }
    let(:spot) { nil }
    let(:buck_id) { "buckeye.1000" }
    let(:email) { "buckeye.1000@osu.edu" }
    let(:instrument) { "any" }
    let(:part) { "any" }
    let(:params) do
      {
        first_name: first_name,
        last_name: last_name,
        role: role,
        instrument: instrument,
        part: part,
        spot: spot,
        buck_id: buck_id,
        email: email
      }
    end

    context "when creating a performing user" do
      let!(:original_user) { create(:user) }
      let(:role) { original_user.role }
      let(:instrument) { original_user.instrument }
      let(:part) { original_user.part }
      let(:spot) { original_user.current_spot.to_s }

      it "creates the new user", :aggregate_failures do
        current_spot = original_user.current_spot
        original_spot = original_user.original_spot

        result = nil
        expect do
          result = described_class.create_user(params: params)
        end.to change { User.count }.by(1)

        expect(result.user).to be_a(User)
        expect(result.user.current_spot).to eq(current_spot)
        expect(result.user.original_spot).to eq(original_spot)
      end

      it "deactivates the user who currently has the spot passed in", :aggregate_failures do
        described_class.create_user(params: params)

        original_user.reload

        expect(original_user.active?).to be(false)
        expect(original_user.current_spot).to be_nil
        expect(original_user.original_spot).to be_nil
      end

      context "but the new instrument isn't allowed with the spot" do
        let(:instrument) { "mellophone" }

        it "doesn't create a new user" do
          expect do
            described_class.create_user(params: params)
          end.not_to change { User.count }
        end

        it "returns the error", :aggregate_failures do
          result = described_class.create_user(params: params)

          expect(result.success?).to be(false)
          expect(result.errors).to eq("Current spot row a, can't be a first mellophone")
        end

        it "doesn't deactivate the original user", :aggregate_failures do
          described_class.create_user(params: params)

          original_user.reload

          expect(original_user.active?).to be(true)
          expect(original_user.current_spot).not_to be_nil
          expect(original_user.original_spot).not_to be_nil
        end
      end

      context "but the provided spot doesn't exist" do
        let(:spot) { "blah" }

        it "doesn't create a new user" do
          expect do
            described_class.create_user(params: params)
          end.not_to change { User.count }
        end

        it "returns an error", :aggregate_failures do
          result = described_class.create_user(params: params)

          expect(result.success?).to be(false)
          expect(result.user).to be_nil
          expect(result.errors).to eq('Spot "blah" doesn\'t exist')
        end
      end

      context "but the non spot fields are invalid" do
        let(:first_name) { nil }

        it "doesn't create a new user" do
          expect do
            described_class.create_user(params: params)
          end.not_to change { User.count }
        end

        it "returns an error", :aggregate_failures do
          result = described_class.create_user(params: params)

          expect(result.success?).to be(false)
          expect(result.user).to be_nil
          expect(result.errors).to include("First name can't be blank")
        end
      end
    end

    context "when creating a non performing user" do
      let(:spot) { nil }
      let(:role) { User::Roles::ADMIN }

      it "creates the user", :aggregate_failures do
        result = described_class.create_user(params: params)

        expect(result.success?).to be(true)
      end
    end

    context "when trying to use an invalid role" do
      let(:role) { nil }

      it "raises an exception" do
        expect do
          described_class.create_user(params: params)
        end.to raise_error(described_class::InvalidRole)
      end
    end
  end
end
