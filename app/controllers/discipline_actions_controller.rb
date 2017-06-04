class DisciplineActionsController < ApplicationController
  before_action :authenticate_user
  before_action :ensure_admin!
  before_action :ensure_performance_is_not_expired!

  def create
    @da = DisciplineAction.new create_params
    if @da.save
      render :show, status: 201
    else
      render json: { resource: 'discipline_action', errors: @da.errors }, status: 409
    end
  end

  def destroy
    DisciplineAction.find(params[:id]).destroy
  end

  private

  def create_params
    params.require(:discipline_action).permit(
      :allowed_to_challenge,
      :open_spot,
      :performance_id,
      :reason,
      :user_buck_id
    )
  end

  def ensure_performance_is_not_expired!
    p = Performance.find_by id: params[:discipline_action][:performance_id]
    p = DisciplineAction.find_by(id: params[:id])&.performance if p.nil?
    return if !p.nil? && p&.window_open?
    render json: { resource: 'discipline_action', errors: [{ performance: 'can\'t be expired' }] }, status: 403
  end
end
