require 'rails_helper'

describe AuthenticationService do
  describe '.authenticate_user' do
    context 'correct buck_id and password' do
      let(:password) { 'password' }
      let(:user) { create(:user, password: password) }
      let(:params) do
        {
          buck_id: user.buck_id,
          password: password
        }
      end

      it 'returns the user' do
        result = described_class.authenticate_user(params)

        expect(result).to eq(user)
      end
    end

    context 'correct buck_id and incorrect password' do
      let(:password) { 'password' }
      let(:user) { create(:user, password: password + 'whoops!') }
      let(:params) do
        {
          buck_id: user.buck_id,
          password: password
        }
      end

      it 'returns something falsey' do
        result = described_class.authenticate_user(params)

        expect(result).to be_falsey
      end
    end

    context 'incorrect buck_id and correct password' do
      let(:password) { 'password' }
      let(:user) { create(:user, password: password) }
      let(:params) do
        {
          buck_id: user.buck_id + 'whoops!',
          password: password
        }
      end

      it 'returns something falsey' do
        result = described_class.authenticate_user(params)

        expect(result).to be_falsey
      end
    end

    context 'incorrect buck_id and password' do
      let(:password) { 'password' }
      let(:user) { create(:user, password: password) }
      let(:params) do
        {
          buck_id: user.buck_id + 'whoops!',
          password: password + 'whoops!'
        }
      end

      it 'returns something falsey' do
        result = described_class.authenticate_user(params)

        expect(result).to be_falsey
      end
    end
  end
end
