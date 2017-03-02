require 'test_helper'

class DisciplineTest < ActiveSupport::TestCase
  test 'is invalid without reason' do
    discipline = build(:discipline, reason: nil)
    refute discipline.valid?
    assert discipline.errors.full_messages.include? 'Reason can\'t be blank'
  end
end
