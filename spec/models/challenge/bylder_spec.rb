# rubocop:disable Lint/AmbiguousBlockAssociation
require 'rails_helper'

describe 'Challenge::Bylder' do
  let!(:performance) { create(:performance) }

  context 'Normal Challenge' do
    let!(:spot) { create(:spot, row: :a, file: 1) }
    let!(:challenger) { create(:user, :spot_a13, :trumpet, :solo) }
    let!(:challengee) { create(:user, :trumpet, :solo, current_spot: spot) }

    it 'creates a valid normal challenge' do
      challenge = Challenge::Bylder.perform challenger, performance, spot

      expect(challenge.valid?).to be(true)
      expect(challenge.normal_challenge_type?).to be(true)
    end
  end

  context 'Open Spot Challenge' do
    let!(:spot) { create(:spot, row: :a, file: 1) }
    let!(:challengee) { create(:user, :trumpet, :solo, current_spot: spot) }
    let!(:challenger) { create(:user, :spot_a13, :trumpet, :solo) }
    let!(:user_da) { create(:discipline_action, user: challengee, performance: performance) }
    let!(:challenge) {
      c = Challenge::Bylder.perform(challenger, performance, spot)
      c.save
      c
    }
    let!(:second_challenger) { create(:user, :spot_x13, :trumpet, :solo) }

    it 'creates a valid open spot challenge' do
      expect(challenge.valid?).to be(true)
      expect(challenge.open_spot_challenge_type?).to be(true)
    end

    it 'adds a second challenger to the challenge' do
      expect {
        Challenge::Bylder.perform(second_challenger, challenge.performance, challenge.spot).save
      }.not_to change { Challenge.count }

      challenge.reload
      expect(challenge.valid?).to be(true)
      expect(challenge.open_spot_challenge_type?).to be(true)
      expect(challenge.users.length).to eq(2)
    end
  end

  context 'Tri Challenge' do
    let!(:spot) { create(:spot, row: :j, file: 1) }
    let!(:challengee) { create(:user, :percussion, :bass, current_spot: spot) }
    let!(:challenger) { create(:user, :spot_j13, :percussion, :bass) }
    let!(:other_challenger) { create(:user, :spot_j17, :percussion, :bass) }

    context 'with more than 3 performers of the same instrument' do
      let!(:extra_member) { create(:user, :spot_j2, :percussion, :bass) }

      it 'creates a valid tri challenge' do
        challenge = Challenge::Bylder.perform challenger, performance, spot

        expect(challenge.valid?).to be(true)
        expect(challenge.tri_challenge_type?).to be(true)
        expect(challenge.users).not_to include(extra_member)
      end
    end
  end
end
# rubocop:enable Lint/AmbiguousBlockAssociation
