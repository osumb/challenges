FactoryBot.define do
  factory :discipline_action do
    reason 'Failed music check'
    open_spot true
    allowed_to_challenge false
    user { FactoryBot.create(:user) }
    performance { FactoryBot.create(:performance) }
  end
end
