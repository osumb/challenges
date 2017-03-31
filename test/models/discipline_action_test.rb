require 'test_helper'

class DisciplineActionTest < ActiveSupport::TestCase
  test 'is invalid without reason' do
    action = build(:discipline_action, reason: nil)
    refute action.valid?
    assert action.errors.full_messages.include? 'Reason can\'t be blank'
  end
end
