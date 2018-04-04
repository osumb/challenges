class TestingController < ApiController
  before_action :authenticate_user
  before_action :ensure_admin!

  TestingControllerError = Class.new(StandardError)

  def exception
    raise TestingControllerError, 'Intentionally raising exception for testing purposes'
  end
end
