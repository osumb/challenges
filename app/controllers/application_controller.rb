class ApplicationController < ActionController::API
  include Knock::Authenticable

  before_action :set_raven_context

  def challenger
    current_user.admin? ? User.find(params[:challenger_buck_id]&.downcase) : current_user
  end

  def ensure_admin!
    return if current_user.admin?
    head 403
  end

  private

  def set_raven_context
    Raven.user_context(user: current_user.attributes.except(:password_digest)) unless current_user.nil?
    Raven.extra_context(params: params.to_unsafe_h, url: request.url)
  end
end
