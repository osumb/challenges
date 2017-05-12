FactoryGirl.define do
  factory :challenge do
    performance { Performance.first || FactoryGirl.create(:performance) }
    spot { Spot.find_by(row: Spot.rows[:a], file: 1) || FactoryGirl.create(:spot) }
  end

  factory :open_spot_challenge, parent: :challenge do
    challenge_type :open_spot
  end

  factory :normal_challenge, parent: :challenge do
    challenge_type :normal
  end

  factory :tri_challenge, parent: :challenge do
    challenge_type :tri
  end
end
