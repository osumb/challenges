require "rails_helper"

RSpec.describe UserChallengesController do
  describe "DELETE destroy" do
    let!(:user_challenge) { create(:normal_challenge).user_challenges.first }
    let!(:current_user) { user_challenge.user }
    let(:request) { delete :destroy, params: { id: user_challenge.id } }
    let(:expected_authenticated_response) { redirect_to("/") }
    let(:expected_unauthenticated_response) { redirect_to("/login") }

    it_behaves_like "controller_authentication"

    context "but the user doesn't own the user challenge" do
      include_context "with authentication"
      let!(:current_user) { create(:user) }

      it "returns a :forbidden" do
        request
        expect(response).to have_http_status(:forbidden)
      end

      it "doesn't delete the user challenge" do
        expect { request }.not_to change { UserChallenge.count }
      end
    end

    context "and the user owns the user challenge" do
      include_context "with authentication"

      it "destroys the user challenge" do
        request

        expect(UserChallenge.find_by(id: user_challenge.id)).to be_nil
      end
    end

    context "and the user is an admin" do
      include_context "with authentication"
      let!(:current_user) { create(:admin_user) }

      it "destroys the user challenge" do
        request

        expect(UserChallenge.find_by(id: user_challenge.id)).to be_nil
      end
    end
  end
end
