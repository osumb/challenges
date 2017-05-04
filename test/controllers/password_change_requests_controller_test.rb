require 'test_helper'

class PasswordChangeRequestsControllerTest < ActionDispatch::IntegrationTest
  def end_point
    '/api/password_change_requests'
  end

  setup do
    @user = create(:user)
  end

  test 'it successfully creates a password change request' do
    old_count = PasswordChangeRequest.count
    body = {
      buck_id: @user.buck_id,
      email: @user.email
    }
    post end_point, params: body.to_json, headers: unauthenticated_header

    assert_equal old_count + 1, PasswordChangeRequest.count
    assert_equal 201, response.status
  end

  test 'it returns a 403 when the user enters an incorrect email' do
    old_count = PasswordChangeRequest.count
    body = {
      buck_id: @user.buck_id,
      email: "#{@user.email}!!!NOT_THE_CORRECT_EMAIL"
    }
    post end_point, params: body.to_json, headers: unauthenticated_header

    assert_equal old_count, PasswordChangeRequest.count
    assert_equal 403, response.status
  end
end
