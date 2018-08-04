class ResetDataController < ApplicationController
  before_action :ensure_authenticated!
  before_action :ensure_admin!

  def reset_data
    file = Files::Uploader.temporarily_save_file(params[:file])
    loader = User::Loader.new(file: file)
    loader.create_users
    Files::Uploader.remove_temporary_file(file)

    if loader.errors.none?
      flash.now[:message] = I18n.t!("client_messages.reset_data.success")
    else
      flash.now[:errors] = loader.errors.messages.join(",")
    end
  end
end
