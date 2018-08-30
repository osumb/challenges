require "rails_helper"

RSpec.describe PasswordResetRequestsController do
  describe "POST create" do
    let(:user) { create(:user) }
    let(:request) { post :create, params: params }
    let(:buck_id) { user.buck_id }
    let(:email) { user.email }

    let(:params) do
      { buck_id: buck_id, email: email }
    end

    it "creates a password reset request" do
      expect do
        request
      end.to change { PasswordResetRequest.count }.by(1)
    end

    it "sends a password reset email" do
      expect(EmailJob).to receive(:perform_later).with(
        klass: "PasswordResetMailer",
        method: "password_reset_email",
        args: { user_buck_id: buck_id, password_reset_request_id: an_instance_of(String) }
      )

      request
    end

    it "redirects back" do
      request

      expect(response).to have_http_status(:redirect)
    end

    it "has a flash message" do
      request

      expect(flash[:message]).to eq("Success! An email has been sent to #{user.email} with instructions")
    end

    context "and the buck_id has a weird casing" do
      let(:params) do
        { buck_id: buck_id.upcase, email: email }
      end

      it "creates a password reset request" do
        expect do
          request
        end.to change { PasswordResetRequest.count }.by(1)
      end
    end

    context "but the email has a weird casing" do
      let(:params) do
        { buck_id: buck_id, email: email.upcase }
      end

      it "creates a password reset request" do
        expect do
          request
        end.to change { PasswordResetRequest.count }.by(1)
      end
    end

    context "but the user doesn't exist" do
      let(:buck_id) { "blah" }

      it "has a flash error" do
        request

        expect(flash[:errors]).to eq("That combination of name.# and password doesn't exist in the system")
      end
    end

    context "but the email doesn't match the one passed in" do
      let(:email) { "blah" }

      it "has a flash error" do
        request

        expect(flash[:errors]).to eq("That combination of name.# and password doesn't exist in the system")
      end
    end
  end

  describe "GET show" do
    let!(:password_reset_request) { create(:password_reset_request) }
    let(:request) { get :show, params: { id: password_reset_request.id } }

    it "renders the show template" do
      request

      expect(response).to render_template(:show)
    end

    it "sets @password_reset_request" do
      request

      expect(assigns(:password_reset_request)).to eq(password_reset_request)
    end

    context "when the request is used" do
      let(:password_reset_request) { create(:password_reset_request, :used) }

      it "sets a flash error" do
        request

        expect(flash[:errors]).to eq("This token has already been used. Please make another one")
      end
    end

    context "when the request is expired" do
      let(:password_reset_request) { create(:password_reset_request, :expired) }

      it "sets a flash error" do
        request

        expect(flash[:errors]).to eq("This token is expired. Please make another one")
      end
    end
  end

  describe "POST reset" do
    let!(:password_reset_request) { create(:password_reset_request) }
    let(:request) { post :reset, params: params }
    let(:password) { "souper secure passw0rd" }
    let(:password_confirmation) { "souper secure passw0rd" }
    let(:params) do
      {
        id: password_reset_request.id,
        password: password,
        password_confirmation: password_confirmation
      }
    end

    it "resets the user's password" do
      request

      user = password_reset_request.user

      expect(BCrypt::Password.new(user.reload.password_digest)).to eq(password)
    end

    context "but the password confirmation doesn't match" do
      let(:password_confirmation) { "ope" }

      it "doesn't update the user's password" do
        request

        user = password_reset_request.user

        expect(BCrypt::Password.new(user.reload.password_digest)).not_to eq(password)
      end

      it "returns a flash error" do
        request

        expect(flash[:errors]).to eq("Make sure the passwords match")
      end
    end

    context "when the request is used" do
      let(:password_reset_request) { create(:password_reset_request, :used) }

      it "sets a flash error" do
        request

        expect(flash[:errors]).to eq("This token can no longer be used")
      end
    end

    context "when the request is expired" do
      let(:password_reset_request) { create(:password_reset_request, :expired) }

      it "sets a flash error" do
        request

        expect(flash[:errors]).to eq("This token can no longer be used")
      end
    end
  end
end
