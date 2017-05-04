require 'test_helper'
require 'bcrypt'

class UsersControllerTest < ActionDispatch::IntegrationTest
  def end_point
    '/api/users'
  end

  setup do
    @user = create(:user)
    @prr = create(:unused_password_reset_request, user: @user)
    @used_prr = create(:used_password_reset_request, user: @user)
    @expired_prr = create(:expired_password_reset_request, user: @user)
  end

  test 'it successfully resets a user\'s password' do
    new_password = 'NEW PASSWORD$$$?!?!?'
    body = {
      password_reset_request_id: @prr.id,
      password: new_password
    }
    post "#{end_point}/#{@user.id}/reset_password", params: body.to_json, headers: unauthenticated_header

    assert_equal 200, response.status
    @user.reload
    @prr.reload
    assert BCrypt::Password.new(@user.password_digest) == new_password
    assert @prr.used
  end

  test 'it returns a 403 if the password reset request is used' do
    new_password = 'NEW PASSWORD$$$?!?!?'
    old_password_digest = @user.password_digest
    body = {
      password_reset_request_id: @used_prr.id,
      password: new_password
    }
    post "#{end_point}/#{@user.id}/reset_password", params: body.to_json, headers: unauthenticated_header

    assert_equal 403, response.status
    @user.reload
    assert_equal old_password_digest, @user.password_digest
  end

  test 'it returns a 403 if the password reset request is expired' do
    new_password = 'NEW PASSWORD$$$?!?!?'
    old_password_digest = @user.password_digest
    body = {
      password_reset_request_id: @expired_prr.id,
      password: new_password
    }
    post "#{end_point}/#{@user.id}/reset_password", params: body.to_json, headers: unauthenticated_header

    assert_equal 403, response.status
    @user.reload
    assert_equal old_password_digest, @user.password_digest
  end

  test 'it returns a 403 if the new password is blank' do
    new_password = ''
    old_password_digest = @user.password_digest
    body = {
      password_reset_request_id: @prr.id,
      password: new_password
    }
    post "#{end_point}/#{@user.id}/reset_password", params: body.to_json, headers: unauthenticated_header

    assert_equal 403, response.status
    @user.reload
    assert_equal old_password_digest, @user.password_digest
  end

  test 'it returns a 403 if the user id doesn\'t match the user associated with the password reset request' do
    new_password = 'NEW PASSWORD$$$?!?!?'
    old_password_digest = @user.password_digest
    body = {
      password_reset_request_id: @prr.id,
      password: new_password
    }
    post "#{end_point}/#{@user.id}123/reset_password", params: body.to_json, headers: unauthenticated_header

    assert_equal 403, response.status
    @user.reload
    assert_equal old_password_digest, @user.password_digest
  end
end
