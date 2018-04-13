RSpec.shared_context 'with authentication' do
  let(:authentication_admin) { false }
  let(:current_user) do
    if authentication_admin
      create(:admin_user)
    else
      create(:user)
    end
  end

  before do
    controller.session[:buck_id] = current_user.buck_id
  end
end
