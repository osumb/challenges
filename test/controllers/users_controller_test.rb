require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest
  test 'GET #index returns a 200' do
    response = get users_url(format: :json)
    assert_equal 200, response
  end
end
