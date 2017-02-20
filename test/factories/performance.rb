FactoryGirl.define do
  factory :performance do
    name 'Oklahoma Game'
    window_open { Time.zone.now }
    window_close { window_open + 3.hours }
    date { Time.zone.now + 2.days }
  end
end
