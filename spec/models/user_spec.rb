require 'rails_helper'

shared_examples_for 'instrument and part validations' do |instrument, parts|
  it 'allows the correct parts' do
    User.parts.select { |_key, value| parts.include? value }.each do |key, _value|
      user = build(:admin_user, instrument, part: User.parts[key])
      expect(user).to be_valid
    end
    User.parts.reject { |_key, value| parts.include? value }.each do |key, _value|
      user = build(:admin_user, instrument, part: User.parts[key])
      expect(user).not_to be_valid
    end
  end
end

describe User, type: :model do
  it { is_expected.to validate_presence_of(:first_name) }
  it { is_expected.to validate_presence_of(:last_name) }
  it { is_expected.to validate_presence_of(:email) }
  it { is_expected.to validate_presence_of(:buck_id) }
  it { is_expected.to validate_presence_of(:instrument) }
  it { is_expected.to validate_presence_of(:part) }
  it { is_expected.to validate_presence_of(:role) }
  it { is_expected.to validate_presence_of(:spot) }

  describe 'callbacks' do
    let(:user) { create(:user, email: email) }
    let(:email) { 'BUCKIDCALLBACKTEST.1@osu.edu' }

    it 'downcases the email on save' do
      expect(user.email).to eq(email.downcase)
    end
  end

  describe 'validations' do
    it 'does not allow multiple users to share a spot' do
      user_a = create(:user)
      user_b = build(:user, spot: user_a.spot)
      expect(user_b).not_to be_valid
    end

    context 'when the user is an admin' do
      it 'cannot have a spot' do
        user = build(:admin_user, :spot_a1)

        user.valid?
        expect(user.errors.full_messages).to include('Role admin or director can\'t have a spot')
      end

      it 'can have any part' do
        User.parts.each do |key, _value|
          user = build(:admin_user, :any, part: User.parts[key])
          expect(user).to be_valid
        end
      end

      context 'when the user is a trumpet player' do
        it_behaves_like 'instrument and part validations',
                        :trumpet,
                        [
                          User.parts[:any],
                          User.parts[:efer],
                          User.parts[:solo],
                          User.parts[:first],
                          User.parts[:second],
                          User.parts[:flugel]
                        ]
      end

      context 'when the user is a mellophone player' do
        it_behaves_like 'instrument and part validations',
                        :mellophone,
                        [
                          User.parts[:any],
                          User.parts[:first],
                          User.parts[:second]
                        ]
      end

      context 'when the user is a trombone player' do
        it_behaves_like 'instrument and part validations',
                        :trombone,
                        [
                          User.parts[:any],
                          User.parts[:first],
                          User.parts[:second],
                          User.parts[:bass]
                        ]
      end

      context 'when the user is a baritone player' do
        it_behaves_like 'instrument and part validations',
                        :baritone,
                        [
                          User.parts[:any],
                          User.parts[:first]
                        ]
      end

      context 'when the user is a percussion player' do
        it_behaves_like 'instrument and part validations',
                        :percussion,
                        [
                          User.parts[:any],
                          User.parts[:snare],
                          User.parts[:cymbals],
                          User.parts[:tenor],
                          User.parts[:bass]
                        ]
      end

      context 'when the user is a sousaphone player' do
        it_behaves_like 'instrument and part validations',
                        :sousaphone,
                        [
                          User.parts[:any],
                          User.parts[:first]
                        ]
      end
    end
  end

  describe '#can_challenge_for_performance?' do
    let(:performance) { build(:performance) }

    context 'when the user is an alternate' do
      let(:user) { build(:alternate_user) }

      specify { expect(user.can_challenge_for_performance?(performance)).to be(true) }

      context 'but the user already made a challenge' do
        before do
          user.challenges << build(:challenge, performance: performance)
        end

        specify { expect(user.can_challenge_for_performance?(performance)).to be(false) }
      end

      context 'but the user has a discipline action' do
        before do
          user.discipline_actions << build(:discipline_action, performance: performance)
        end

        specify { expect(user.can_challenge_for_performance?(performance)).to be(false) }
      end
    end

    context 'when the user is a regular member' do
      let(:user) { build(:user) }

      specify { expect(user.can_challenge_for_performance?(performance)).to be(false) }

      context 'but the user has a discipline action' do
        before do
          user.discipline_actions << build(
            :discipline_action,
            performance: performance,
            allowed_to_challenge: allowed_to_challenge
          )
        end

        context 'and they are flagged as allowed to challenge' do
          let(:allowed_to_challenge) { true }

          specify { expect(user.can_challenge_for_performance?(performance)).to be(true) }

          context 'but they already made a challenge' do
            before do
              user.challenges << build(:challenge, performance: performance)
            end

            specify { expect(user.can_challenge_for_performance?(performance)).to be(false) }
          end
        end

        context 'and they are not flagged as allowed to challenge' do
          let(:allowed_to_challenge) { false }

          specify { expect(user.can_challenge_for_performance?(performance)).to be(false) }
        end
      end
    end

    context 'when the user is an admin' do
      let(:user) { build(:admin_user) }

      specify { expect(user.can_challenge_for_performance?(performance)).to be(false) }
    end
  end
end
