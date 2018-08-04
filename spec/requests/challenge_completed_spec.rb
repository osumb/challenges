require "rails_helper"

describe "Challenge Comment Updates", type: :request do
  let(:user) { create(:admin_user) }
  let(:challenge) { create(:normal_challenge) }

  describe "GET /api/challenges/completed" do
    subject(:request) { get endpoint, headers: authenticated_header(user) }
    let(:endpoint) { "/api/challenges/completed" }

    before do
      allow(Challenge).to receive(:completed).with(user).and_return([challenge])
    end

    it "has the correct status" do
      request
      expect(response).to have_http_status(:ok)
    end

    it "is includes the user_challenges and the users" do
      request
      result = JSON.parse(response.body).with_indifferent_access

      expect(result[:challenges][0][:user_challenges][0]).not_to be_nil
      expect(result[:challenges][0][:user_challenges][0][:user]).not_to be_nil
    end
  end
end
