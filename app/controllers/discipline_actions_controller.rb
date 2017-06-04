class DisciplineActionsController < ApplicationController
  before_action :authenticate_user
  before_action :ensure_admin!

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
end
