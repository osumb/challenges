require 'rails_helper'

describe UserService do
  context '.create' do
    let(:attributes) do
      {
        first_name: 'First',
        last_name: 'Last',
        buck_id: 'last.1',
        email: 'last.1@osu.edu',
        role: 'squad_leader',
        instrument: 'trumpet',
        part: 'solo',
        spot: { row: :a, file: 2 }
      }
    end
    let(:user) do
      { user: attributes }
    end
    let(:params) { ActionController::Parameters.new(user) }

    context 'performer' do
      let(:spot) { create(:spot, row: attributes[:spot][:row], file: attributes[:spot][:file]) }
      let!(:old_user) { create(:user, current_spot: spot) }

      context 'invalid performer' do
        let(:attributes) do
          {
            last_name: 'Last',
            buck_id: 'last.1',
            email: 'last.1@osu.edu',
            role: 'squad_leader',
            instrument: 'trumpet',
            part: 'solo',
            spot: { row: :a, file: 2 }
          }
        end

        it 'doesn\'t deactivate the user who was holding the new user\'s spot' do
          UserService.create(params: params)

          expect(old_user.active).to be(true)
          expect(old_user.current_spot).not_to be_nil
          expect(old_user.original_spot).not_to be_nil
        end
      end

      it 'returns a valid performing user' do
        result = UserService.create(params: params)
        spot = Spot.find_by(row: attributes[:spot][:row], file: attributes[:spot][:file])

        expect(result.valid?).to be(true)
        expect(result.performer?).to be(true)
        expect(result.first_name).to eq(attributes[:first_name])
        expect(result.last_name).to eq(attributes[:last_name])
        expect(result.buck_id).to eq(attributes[:buck_id])
        expect(result.email).to eq(attributes[:email])
        expect(result.role).to eq(attributes[:role])
        expect(result.instrument).to eq(attributes[:instrument])
        expect(result.part).to eq(attributes[:part])
        expect(result.current_spot).to eq(spot)
        expect(result.original_spot).to eq(spot)
      end

      it 'saves the user' do
        expect do
          UserService.create(params: params)
        end.to change { User.count }.by(1)
      end

      it 'deactivates the user who was holding the new user\'s spot' do
        UserService.create(params: params)

        old_user.reload

        expect(old_user.active).to be(false)
        expect(old_user.current_spot).to be_nil
        expect(old_user.original_spot).to be_nil
      end
    end

    context 'non performer' do
      let(:attributes) do
        {
          first_name: 'First',
          last_name: 'Last',
          buck_id: 'last.1',
          email: 'last.1@osu.edu',
          role: 'admin',
          instrument: 'trumpet',
          part: 'solo'
        }
      end

      it 'returns a valid non performing user' do
        result = UserService.create(params: params)

        expect(result.valid?).to be(true)
        expect(result.first_name).to eq(attributes[:first_name])
        expect(result.last_name).to eq(attributes[:last_name])
        expect(result.buck_id).to eq(attributes[:buck_id])
        expect(result.email).to eq(attributes[:email])
        expect(result.role).to eq(attributes[:role])
        expect(result.instrument).to eq(attributes[:instrument])
        expect(result.part).to eq(attributes[:part])
        expect(result.performer?).to be(false)
      end

      it 'saves the user' do
        expect do
          UserService.create(params: params)
        end.to change { User.count }.by(1)
      end
    end

    context 'required params' do
      let(:attributes) do
        {
          first_name: 'First',
          last_name: 'Last',
          buck_id: 'last.1',
          email: 'last.1@osu.edu',
          role: 'squad_leader',
          instrument: 'any',
          part: 'any'
        }
      end
      let(:deleted_attribute) { nil }
      let(:user) do
        attributes.delete(deleted_attribute)
        { user: attributes }
      end
      let(:params) { ActionController::Parameters.new(user) }

      context 'missing first_name' do
        let(:deleted_attribute) { :first_name }

        it 'returns the appropriate errors' do
          result = UserService.create(params: params)

          expect(result.valid?).to be(false)
          expect(result.errors.messages).to include(:first_name)
        end
      end

      context 'missing last_name' do
        let(:deleted_attribute) { :last_name }

        it 'returns the appropriate errors' do
          result = UserService.create(params: params)

          expect(result.valid?).to be(false)
          expect(result.errors.messages).to include(:last_name)
        end
      end

      context 'missing buck_id' do
        let(:deleted_attribute) { :buck_id }

        it 'returns the appropriate errors' do
          result = UserService.create(params: params)

          expect(result.valid?).to be(false)
          expect(result.errors.messages).to include(:buck_id)
        end
      end

      context 'missing email' do
        let(:deleted_attribute) { :email }

        it 'returns the appropriate errors' do
          result = UserService.create(params: params)

          expect(result.valid?).to be(false)
          expect(result.errors.messages).to include(:email)
        end
      end

      context 'missing role' do
        let(:deleted_attribute) { :role }

        it 'returns the appropriate errors' do
          result = UserService.create(params: params)

          expect(result.valid?).to be(false)
          expect(result.errors.messages).to include(:role)
        end
      end

      context 'missing instrument' do
        let(:deleted_attribute) { :instrument }

        it 'returns the appropriate errors' do
          result = UserService.create(params: params)

          expect(result.valid?).to be(false)
          expect(result.errors.messages).to include(:instrument)
        end
      end

      context 'missing part' do
        let(:deleted_attribute) { :part }

        it 'returns the appropriate errors' do
          result = UserService.create(params: params)

          expect(result.valid?).to be(false)
          expect(result.errors.messages).to include(:part)
        end
      end
    end
  end

  context '.deactivate_user' do
    let(:user) { create(:user, :active) }

    it 'deactivates a user' do
      result = UserService.deactivate_user(buck_id: user.buck_id)

      expect(result.valid?).to be(true)
      expect(result.active?).to be(false)
    end

    it 'removes the current spot and original spot relations' do
      result = UserService.deactivate_user(buck_id: user.buck_id)

      expect(result.current_spot).to be_nil
      expect(result.original_spot).to be_nil
    end
  end
end
