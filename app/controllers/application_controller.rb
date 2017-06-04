# frozen_string_literal: true
class ApplicationController < ActionController::API
  include Knock::Authenticable

  def challenger
    current_user.admin? ? User.find(params[:challenger_buck_id]) : current_user
  end

  def ensure_admin!
    return if current_user.admin?
    head 403
  end
end
