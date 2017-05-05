require 'test_helper'

class PasswordResetRequestTest < ActiveSupport::TestCase
  test 'can\'t reuse password change request' do
    prr = create(:used_password_reset_request)

    prr.used = false
    refute prr.valid?
    assert prr.errors.full_messages.join.include? 'can\'t be reused'
  end
end
