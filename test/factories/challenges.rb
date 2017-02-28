FactoryGirl.define do
  factory :challenge do
  end

  factory :open_spot_challenge, parent: :challenge do
  end

  factory :normal_challenge, parent: :challenge do
  end

  factory :tri_challenge, parent: :challenge do
  end
end
