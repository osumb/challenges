class PasswordResetRequestsController < ApplicationController
  # rubocop:disable Metrics/MethodLength
  def create
    user = User.find_by buck_id: params[:buck_id]
    unless !user.nil? && user.email == params[:email]&.downcase
      head 403
      return
    end
    @prr = PasswordResetRequest.new user: user
    # We're reloading because prr.expires is a default value created in the db. Unfortunately, it doesn't get returned
    if @prr.save && @prr.reload
      render :create, status: 201
    else
      render json: { resource: 'PasswordResetRequest', errors: @prr.errors }, status: 409
    end
  end
  # rubocop:enable Metrics/MethodLength

  def show
    @prr = PasswordResetRequest.find_by params[:id]
  end
end
