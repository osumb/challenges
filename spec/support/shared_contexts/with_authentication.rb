RSpec.shared_context 'with authentication' do
  before do
    controller.session[:buck_id] = current_user.buck_id
  end
end
