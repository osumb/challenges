shared_examples_for "controller_authentication" do
  context "when not authenticated" do
    it "redirects to login" do
      request
      expect(response).to expected_unauthenticated_response
    end
  end

  context "when authenticated" do
    include_context "with authentication"

    it "renders the correct template" do
      request
      expect(response).to expected_authenticated_response
    end
  end
end
