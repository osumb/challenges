require 'rails_helper'

describe Challenge, type: :model do
  it { is_expected.to have_many(:user_challenges) }
  it { is_expected.to have_many(:users).through(:user_challenges) }
  it { is_expected.to belong_to(:spot) }
  it { is_expected.to belong_to(:performance) }

  describe 'validations' do
    context 'normal challenge' do
      subject { build(:normal_challenge) }

      it 'is invalid without 2 users' do
        subject.users = [subject.users.first] # remove a user
        subject.valid?
        expect(subject.errors.full_messages)
          .to include('Users only two users are allowed in a normal challenge')
      end

      it 'is valid with 2 users' do
        subject.valid?
        expect(subject.errors.full_messages)
          .not_to include('Users only two users are allowed in a normal challenge')
      end

      it 'requires users in a challenge to have the same instrument and part' do
        subject.users = [build(:user, :trumpet, :solo), build(:user, :trumpet, :first)]
        subject.valid?
        expect(subject.errors.full_messages)
          .to include('Users must all have the same instrument and part')
      end

      it 'requires users in a challenge to not be admins or directors' do
        subject.users = [build(:admin_user), build(:user)]

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

    context 'open spot challenge' do
      subject { build(:open_spot_challenge) }

      it 'is invalid with no users' do
        subject.users = []

        subject.valid?
        expect(subject.errors.full_messages)
          .to include('Users no more than two users are allowed in an open spot challenge')
      end

      it 'is valid with 2 users' do
        subject.users = [build(:user), build(:user)]

        subject.valid?
        expect(subject.errors.full_messages)
          .not_to include('Users no more than two users are allowed in an open spot challenge')
      end
    end

    context 'tri challenge' do
      subject { build(:tri_challenge) }

      it 'is invalid without 3 users' do
        subject.users = []
        subject.valid?
        expect(subject.errors.full_messages)
          .to include('Users only three users are allowed in a tri challenge')
      end

      it 'is valid with 3 users' do
        subject.users = [build(:user), build(:user), build(:user)]
        subject.valid?
        expect(subject.errors.full_messages)
          .not_to include('Users only three users are allowed in a tri challenge')
      end

      it 'can\'t involve all rows' do
        invalid_rows = Spot.rows.reject { |row| Challenge.tri_challenge_rows.include? row.to_sym }
        invalid_rows.each do |_, row_value|
          subject.spot = build(:spot, row: row_value)

          subject.valid?
          expect(subject.errors.full_messages)
            .to include('Challenge tri challenges can only involve the following rows: [j]')
        end
      end
    end

    describe '#full?' do
      context 'when the challenge is normal' do
        subject { build(:normal_challenge) }

        it 'is full with two users' do
          expect(subject.full?).to be(true)
        end

        it 'is not full with less than two users' do
          subject.users = []
          expect(subject.full?).to be(false)
        end
      end

      context 'when the challenge is open spot' do
        subject { build(:open_spot_challenge) }
        it 'is full with two users' do
          subject.users = [build(:user), build(:user)]

          expect(subject.full?).to be(true)
        end

        it 'is not full with less than two users' do
          subject.users = [build(:user)]
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
          subject.users = []
          expect(subject.full?).to be(false)
        end
      end
    end
  end

  describe '#can_be_evaluated_by?' do
    subject(:challenge) { create(:normal_challenge, spot: create(:spot, row: :x, file: 1)) }
    let(:current_instrument) { challenge.users.first.instrument }
    let(:spot_in_challenge_row) { create(:spot, row: challenge.spot.row, file: 2) }
    let(:spot_in_first_user_row) { create(:spot, row: challenge.users.first.spot.row, file: 2) }
    let(:spot_in_last_user_row) { create(:spot, row: challenge.users.last.spot.row, file: 2) }
    let(:last_user_row) { challenge.users.last.spot.row }
    let(:other_instrument) do
      User.instruments.find { |key, _value| key != current_instrument && key != 'any' }.first.to_sym
    end
    let(:spot_in_other_row) do
      taken_spots = challenge.users.map { |user| user.spot.row }
      row = Spot.rows.find { |key, _value| !taken_spots.include?(key) }.first.to_sym
      create(:spot, row: row, file: 2)
    end

    context 'when a member is evaluating' do
      let(:user) { create(:user, :member) }

      specify { expect(challenge.can_be_evaluated_by?(user: user)).to be(false) }
    end

    context 'when an admin is evaluating' do
      let(:user) { create(:user, :admin) }

      specify { expect(challenge.can_be_evaluated_by?(user: user)).to be(true) }
    end

    context 'when a director is evaluating' do
      context 'and they have any instrument' do
        let(:user) { create(:user, :director, instrument: :any) }

        specify { expect(challenge.can_be_evaluated_by?(user: user)).to be(true) }
      end

      context 'and they have the same instrument' do
        let(:user) { create(:user, :director, instrument: current_instrument) }

        specify { expect(challenge.can_be_evaluated_by?(user: user)).to be(true) }
      end

      context 'and they do not have the same instrument' do
        let(:user) { create(:user, :director, instrument: other_instrument, part: :first) }

        specify { expect(challenge.can_be_evaluated_by?(user: user)).to be(false) }
      end
    end

    context 'when a squad leader is evaluating' do
      context 'and they are in the row of the challenge' do
        let(:user) do
          create(:user, :squad_leader, instrument: current_instrument, spot: spot_in_challenge_row)
        end

        specify { expect(challenge.can_be_evaluated_by?(user: user)).to be(true) }
      end

      context 'and they are in the row of one of the participants' do
        let(:user_1) do
          create(:user, :squad_leader, instrument: current_instrument, spot: spot_in_first_user_row)
        end
        let(:user_2) do
          create(:user, :squad_leader, instrument: current_instrument, spot: spot_in_last_user_row)
        end

        specify { expect(challenge.can_be_evaluated_by?(user: user_1)).to be(true) }
        specify { expect(challenge.can_be_evaluated_by?(user: user_2)).to be(true) }
      end

      context 'and they are in an entirely different row' do
        let(:user) do
          create(:user, :squad_leader, instrument: :trumpet, part: :first, spot: spot_in_other_row)
        end

        specify { expect(challenge.can_be_evaluated_by?(user: user)).to be(false) }
      end
    end
  end
end
