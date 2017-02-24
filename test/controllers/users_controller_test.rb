require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  test 'GET #index returns an array' do
    response = get users_url(format: :json)
    assert_equal 200, response
  end
end
