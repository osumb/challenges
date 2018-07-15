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

  def update
    args = update_params.to_h.merge(client_timezone: params['timezone'], id: params['id']).deep_symbolize_keys
    @performance = PerformanceService.update(args)
    flash = if @performance.valid?
              { message: I18n.t!('client_messages.performances.update.success') }
            else
              { errors: @performance.errors.full_messages.join(',') }
            end
    redirect_to('/performances', flash: flash)
  end

  def destroy
    performance = Performance.find(params['id'])
    flash = if performance.destroy
              { message: I18n.t!('client_messages.performances.destroy.success') }
            else
              { errors: @performances.errors.full_messages.join(',') }
            end
    redirect_to('/performances', flash: flash)
  end

  def email_challenge_list
    PerformanceService.email_challenge_list(performance_id: params[:id].to_i)
    redirect_to(
      '/performances',
      flash: { message: I18n.t!('client_messages.performances.email_challenge_list.success') }
    )
  end

  def index
    @performances = Performance.all.order(window_open: :asc)
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

  def update_params
    create_params
  end
end
