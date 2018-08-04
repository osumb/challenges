FactoryBot.define do
  factory :performance do
    name "Oklahoma Game"
    window_open { Time.zone.now }
    window_close { window_open + 3.hours }
    date { Time.zone.now + 2.days }
  end

  factory :stale_performance, parent: :performance do
    window_open { Time.zone.now - 1.day }
    window_close { Time.zone.now - 21.hours }
  end
end
