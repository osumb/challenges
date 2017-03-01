FactoryGirl.define do
  factory :challenge do
    performance Performance.first
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
