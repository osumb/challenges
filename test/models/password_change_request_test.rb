require 'test_helper'

class PasswordChangeRequestTest < ActiveSupport::TestCase
  test 'can\'t reuse password change request' do
    pcr = create(:used_password_change_request)

    pcr.used = false
    refute pcr.valid?
    assert pcr.errors.full_messages.join.include? 'can\'t be reused'
  end
end
