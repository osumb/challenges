require 'bcrypt'

password_digest = BCrypt::Password.create 'password'

FactoryBot.define do
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
    association :current_spot, factory: :spot, row: :a, file: 2
    original_spot do
      current_spot
    end
    active true

    trait :director do
      role User.roles[:director]
      association :current_spot, factory: :spot, strategy: :null
    end

    trait :admin do
      role User.roles[:admin]
      association :current_spot, factory: :spot, strategy: :null
    end

    trait :squad_leader do
      role User.roles[:squad_leader]
      association :current_spot, factory: :spot, row: :a, file: 1
    end

    trait :member do
      role User.roles[:member]
    end

    trait :alternate do
      association :current_spot, factory: :spot, file: 13
    end

    trait :active do
      active true
    end

    trait :inactive do
      active false
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
        association :current_spot, factory: :spot, row: value
      end
    end

    Spot.rows.each do |name, value|
      (1..18).each do |file|
        trait "spot_#{name}#{file}".to_sym do
          association :current_spot, factory: :spot, row: value, file: file
        end
      end
    end

    factory :admin_user, traits: [:admin]
    factory :alternate_user, traits: [:alternate]
  end
end
