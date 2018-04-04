class SpotsController < ApiController
  before_action :authenticate_user
  before_action :ensure_admin!

  def find
    @spot = SpotService.find(query: params[:query])

    head 404 if @spot.nil?
  end
end
