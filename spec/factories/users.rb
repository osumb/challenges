require 'bcrypt'

password_digest = BCrypt::Password.create 'password'

FactoryGirl.define do
  factory :user do
    first_name 'Brutus'
    last_name 'Buckeye'
    sequence(:email) { |n| "smith.#{n}@osu.edu" }
    password_digest password_digest
    sequence(:buck_id) { |n| "buckeye.#{n}" }
    instrument User.instruments[:trumpet]
    part User.parts[:solo]
    role User.roles[:member]
    password_updated Time.zone.now
    association :spot, row: Spot.rows[:a], file: 2

    trait :admin do
      role User.roles[:admin]
      spot nil
    end

    trait :alternate do
      association :spot, file: 13
    end

    User.instruments.each do |name, value|
      trait name.to_sym do
        instrument value
      end
    end

    User.parts.each do |name, value|
      trait name.to_sym do
        part value
      end
    end

    Spot.rows.each do |name, value|
      trait "#{name}_row".to_sym do
        association :spot, row: value
      end
    end

    Spot.rows.each do |name, value|
      (1..18).each do |file|
        trait "spot_#{name}#{file}".to_sym do
          association :spot, row: value, file: file
        end
      end
    end

    factory :admin_user, traits: [:admin]
    factory :alternate_user, traits: [:alternate]
  end
end
