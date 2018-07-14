class PerformancesController < ApplicationController
  before_action :ensure_authenticated!
  before_action :ensure_admin!

  def create
    flash = {}
    args = create_params.to_h.merge(client_timezone: params['timezone']).deep_symbolize_keys
    @performance = PerformanceService.create(args)
    if @performance.valid?
      flash = { message: I18n.t!('client_messages.performances.create.success') }
      QueueNewPerformanceEmailsJob.perform_later(performance_id: @performance.id)
    else
      flash = { errors: @performance.errors.full_messages.join(',') }
    end
    redirect_to('/performances/new', flash: flash)
  end

  def new; end

  private

  def create_params
    params.require(:performance).permit(
      :name,
      :date,
      :window_close,
      :window_open
    )
  end
end
