FactoryGirl.define do
  factory :password_reset_request do
    used false
    expires Time.zone.now + 1.hour
    user { User.first || FactoryGirl.create(:user) }

    trait :used do
      used true
    end

    trait :unused do
      used false
    end

    trait :expired do
      expires Time.zone.now - 1.hour
    end

    factory :used_password_reset_request, traits: [:used]
    factory :unused_password_reset_request, traits: [:unused]
    factory :expired_password_reset_request, traits: [:expired]
  end
end
