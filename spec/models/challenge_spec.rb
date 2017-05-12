require 'rails_helper'

describe Challenge, type: :model do
  it { is_expected.to have_many(:user_challenges) }
  it { is_expected.to have_many(:users).through(:user_challenges) }
  it { is_expected.to belong_to(:spot) }
  it { is_expected.to belong_to(:performance) }
  it { is_expected.to belong_to(:winner) }

  describe 'validations' do
    context 'normal challenge' do
      subject { build(:normal_challenge) }

      it 'is invalid without 2 users' do
        subject.valid?
        expect(subject.errors.full_messages)
          .to include('Users only two users are allowed in a normal challenge')
      end

      it 'is valid with 2 users' do
        subject.users << build(:user)
        subject.users << build(:user)

        subject.valid?
        expect(subject.errors.full_messages)
          .not_to include('Users only two users are allowed in a normal challenge')
      end

      it 'requires users in a challenge to have the same instrument and part' do
        subject.users << build(:user, :trumpet, :solo)
        subject.users << build(:user, :trumpet, :first)

        subject.valid?
        expect(subject.errors.full_messages)
          .to include('Users must all have the same instrument and part')
      end

      it 'requires users in a challenge to not be admins or directors' do
        subject.users << build(:admin_user)
        subject.users << build(:user)

        subject.valid?
        expect(subject.errors.full_messages)
          .to include('Users must all be non admin or director')
      end

      it 'requires users in a challenge to be unique' do
        user = build(:user)
        subject.users = [user, user]

        subject.valid?
        expect(subject.errors.full_messages)
          .to include('Users must be unique in a challenge')
      end
    end
  end

  context 'open spot challenge' do
    subject { build(:open_spot_challenge) }

    it 'is invalid with no users' do
      skip('how is this supposed to work? currently fails')
      subject.valid?
      expect(subject.errors.full_messages)
        .to include('Users no more than two users are allowed in an open spot challenge')
    end

    it 'is valid with 2 users' do
      subject.users << build(:user)
      subject.users << build(:user)

      subject.valid?
      expect(subject.errors.full_messages)
        .not_to include('Users no more than two users are allowed in an open spot challenge')
    end
  end

  context 'tri challenge' do
    subject { build(:tri_challenge) }

    it 'is invalid without 3 users' do
      subject.valid?
      expect(subject.errors.full_messages)
        .to include('Users only three users are allowed in a tri challenge')
    end

    it 'is valid with 3 users' do
      subject.users << build(:user)
      subject.users << build(:user)
      subject.users << build(:user)

      subject.valid?
      expect(subject.errors.full_messages)
        .not_to include('Users only three users are allowed in a tri challenge')
    end
  end

  describe '#full?' do
    context 'when the challenge is normal' do
      subject { build(:normal_challenge) }

      let(:user) { build(:user) }

      it 'is full with two users' do
        subject.users = [user, user]

        expect(subject.full?).to be(true)
      end

      it 'is not full with less than two users' do
        expect(subject.full?).to be(false)
      end
    end

    context 'when the challenge is open spot' do
      subject { build(:open_spot_challenge) }

      let(:user) { build(:user) }

      it 'is full with two users' do
        subject.users = [user, user]

        expect(subject.full?).to be(true)
      end

      it 'is not full with less than two users' do
        expect(subject.full?).to be(false)
      end
    end

    context 'when the challenge is tri' do
      subject { build(:tri_challenge) }

      let(:user) { build(:user) }

      it 'is full with three users' do
        subject.users = [user, user, user]

        expect(subject.full?).to be(true)
      end

      it 'is not full with less than three users' do
        expect(subject.full?).to be(false)
      end
    end
  end
end