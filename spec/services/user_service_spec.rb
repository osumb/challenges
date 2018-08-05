require "rails_helper"

describe UserService do
  describe ".deactivate_user" do
    let(:user) { create(:user, :active) }

    it "deactivates a user" do
      result = described_class.deactivate_user(buck_id: user.buck_id)

      expect(result.valid?).to be(true)
      expect(result.active?).to be(false)
    end

    it "removes the current spot and original spot relations" do
      result = described_class.deactivate_user(buck_id: user.buck_id)

      expect(result.current_spot).to be_nil
      expect(result.original_spot).to be_nil
    end
  end

  describe ".swap_in_new_user" do
    let(:attributes) do
      {
        first_name: "First",
        last_name: "Last",
        buck_id: "last.1",
        email: "last.1@osu.edu",
        role: "squad_leader",
        instrument: "trumpet",
        part: "solo",
        spot: { row: :a, file: 2 }
      }
    end
    let(:params) { ActionController::Parameters.new(user: attributes) }
    let(:user) do
      described_class.create(params: params)
    end
    let!(:spot) { create(:spot, row: attributes[:spot][:row], file: attributes[:spot][:file]) }
    let!(:old_user) { create(:user, :member, current_spot: spot) }

    it "saves the new user" do
      expect do
        described_class.swap_in_new_user(user: user)
      end.to change { User.count }.by 1
    end

    context "new user has a spot" do
      it "deactivates the user currently holding the spot" do
        described_class.swap_in_new_user(user: user)

        old_user.reload

        expect(old_user.active).to be(false)
        expect(old_user.current_spot).to be_nil
        expect(old_user.original_spot).to be_nil
      end
    end

    context "new user doesn't have a spot" do
      before do
        attributes.delete(:spot)
      end

      it "doesn't deactivate a new user" do
        expect(described_class).not_to receive(:deactivate_user)

        described_class.swap_in_new_user(user: user)
      end
    end
  end
end
