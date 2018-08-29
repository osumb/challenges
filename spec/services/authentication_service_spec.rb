require "rails_helper"

describe AuthenticationService do
  describe ".authenticate_user" do
    let(:session) { {} }

    context "correct buck_id and password" do
      let(:password) { "password" }
      let(:user) { create(:user, password: password) }
      let(:params) do
        {
          buck_id: user.buck_id,
          password: password
        }
      end

      context "and the username has a weird casing" do
        let(:params) do
          {
            buck_id: user.buck_id.upcase,
            password: password
          }
        end

        it "returns the user" do
          result = described_class.authenticate_user(params, session)

          expect(result).to eq(user)
        end
      end

      it "returns the user" do
        result = described_class.authenticate_user(params, session)

        expect(result).to eq(user)
      end

      it "sets the session :buck_id" do
        described_class.authenticate_user(params, session)

        expect(session[:buck_id]).to eq(user.buck_id)
      end
    end

    context "correct buck_id and incorrect password" do
      let(:password) { "password" }
      let(:user) { create(:user, password: password + "whoops!") }
      let(:params) do
        {
          buck_id: user.buck_id,
          password: password
        }
      end

      it "returns something falsey" do
        result = described_class.authenticate_user(params, session)

        expect(result).to be_falsey
      end
    end

    context "incorrect buck_id and correct password" do
      let(:password) { "password" }
      let(:user) { create(:user, password: password) }
      let(:params) do
        {
          buck_id: user.buck_id + "whoops!",
          password: password
        }
      end

      it "returns something falsey" do
        result = described_class.authenticate_user(params, session)

        expect(result).to be_falsey
      end
    end

    context "incorrect buck_id and password" do
      let(:password) { "password" }
      let(:user) { create(:user, password: password) }
      let(:params) do
        {
          buck_id: user.buck_id + "whoops!",
          password: password + "whoops!"
        }
      end

      it "returns something falsey" do
        result = described_class.authenticate_user(params, session)

        expect(result).to be_falsey
      end
    end

    context "no password" do
      let(:user) { create(:user, password: " ") }
      let(:params) do
        {
          buck_id: user.buck_id + "whoops!"
        }
      end

      it "doesn't error" do
        expect do
          described_class.authenticate_user(params, session)
        end.not_to raise_error
      end
    end
  end

  describe ".log_out_user" do
    let(:session) do
      { buck_id: "fake_buck_id" }
    end

    it "sets the session :buck_id to nil" do
      described_class.log_out_user(session)

      expect(session[:buck_id]).to be_nil
    end
  end
end
