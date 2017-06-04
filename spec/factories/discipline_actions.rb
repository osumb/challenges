FactoryGirl.define do
  factory :discipline_action do
    reason 'Failed music check'
    open_spot true
    allowed_to_challenge false
    user { FactoryGirl.create(:user) }
    performance { FactoryGirl.create(:performance) }
  end
end
