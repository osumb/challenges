require 'rails_helper'

describe 'Challenge::Bylder' do
  let(:performance) { create(:performance) }

  context 'Normal Challenge' do
    let!(:spot) { create(:spot, row: :a, file: 1) }
    let!(:challenger) { create(:user, :spot_a13, :trumpet, :solo) }
    let!(:challengee) { create(:user, :trumpet, :solo, spot: spot) }

    it 'creates a valid normal challenge' do
      challenge = Challenge::Bylder.perform challenger, performance, spot

      expect(challenge.valid?).to be(true)
      expect(challenge.normal_challenge_type?).to be(true)
    end
  end

  context 'Open Spot Challenge' do
    let!(:spot) { create(:spot, row: :a, file: 1) }
    let!(:challengee) { create(:user, :trumpet, :solo, spot: spot) }
    let!(:challenger) { create(:user, :spot_a13, :trumpet, :solo) }
    let!(:user_da) { create(:discipline_action, user: challengee, performance: performance) }

    it 'creates a valid open spot challenge' do
      challenge = Challenge::Bylder.perform challenger, performance, spot

      expect(challenge.valid?).to be(true)
      expect(challenge.open_spot_challenge_type?).to be(true)
    end
  end

  context 'Tri Challenge' do
    let!(:spot) { create(:spot, row: :j, file: 1) }
    let!(:challengee) { create(:user, :percussion, :bass, spot: spot) }
    let!(:challenger) { create(:user, :spot_j13, :percussion, :bass) }
    let!(:other_challenger) { create(:user, :spot_j17, :percussion, :bass) }

    it 'creates a valid tri challenge' do
      challenge = Challenge::Bylder.perform challenger, performance, spot

      expect(challenge.valid?).to be(true)
      expect(challenge.tri_challenge_type?).to be(true)
    end
  end
end
