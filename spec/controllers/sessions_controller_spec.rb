require "rails_helper"

RSpec.describe SessionsController do
  let(:current_user) { create(:user) }

  describe "GET new" do
    let(:request) { get :new }
    let(:expected_authenticated_response) { redirect_to("/logged_in") }
    let(:expected_unauthenticated_response) { render_template("new") }

    it_behaves_like "controller_authentication"
  end

  describe "GET show" do
    let(:request) { get :show }
    let(:expected_authenticated_response) { render_template("show") }
    let(:expected_unauthenticated_response) { redirect_to("/login") }

    it_behaves_like "controller_authentication"

    shared_examples_for "variable assignment" do
      it "assigns the correct value" do
        request
        expect(assigns(variable)).to eq(expected_value)
      end
    end

    shared_examples_for "variable non assignment" do
      it "doesn't assign the correct variable" do
        request
        expect(assigns(variable)).to be_nil
      end
    end

    context "setting information for the view" do
      include_context "with authentication"

      context "for an admin user" do
        let!(:current_user) { create(:admin_user) }

        context "performance" do
          let(:variable) { :performance }
          it_behaves_like "variable non assignment"
        end

        context "current_challenge" do
          let(:variable) { :current_challenge }
          it_behaves_like "variable non assignment"
        end

        context "current_user_challenge" do
          let(:variable) { :current_user_challenge }
          it_behaves_like "variable non assignment"
        end

        context "current_discipline_action" do
          let(:variable) { :current_discipline_action }
          it_behaves_like "variable non assignment"
        end

        context "challenges" do
          let(:variable) { :challenges }
          it_behaves_like "variable non assignment"
        end
      end

      context "for a non admin user" do
        let!(:current_user) { create(:user) }
        let!(:performance) { create(:performance) }

        context "performance" do
          let(:variable) { :performance }
          let(:expected_value) { performance }
          it_behaves_like "variable assignment"
        end

        context "current_challenge" do
          let(:variable) { :current_challenge }

          context "but the user hasn't made a challenge" do
            it_behaves_like "variable non assignment"
          end

          context "but the challenge is for the current users's spot" do
            let(:challenge) { create(:normal_challenge, performance: performance) }
            let!(:current_user) { challenge.users.select { |u| u.current_spot_id == challenge.spot_id }.first }

            it_behaves_like "variable non assignment"
          end

          context "and the user has made a challenge" do
            let(:challenge) { create(:normal_challenge, performance: performance) }
            let!(:current_user) { challenge.users.first }
            let(:expected_value) { challenge }
            it_behaves_like "variable assignment"

            context "but is isn't for the next performance" do
              before do
                challenge.performance.update!(window_close: 2.days.ago, window_open: 3.days.ago)
              end

              it_behaves_like "variable non assignment"
            end
          end
        end

        context "current_user_challenge" do
          let(:variable) { :current_user_challenge }

          context "but the user doesn't have one" do
            it_behaves_like "variable non assignment"
          end

          context "and the user has one" do
            let(:challenge) { create(:normal_challenge, performance: performance) }
            let!(:current_user) { challenge.users.first }
            let(:user_challenge) { UserChallenge.find_by(challenge: challenge, user: current_user) }
            let(:expected_value) { user_challenge }

            it_behaves_like "variable assignment"

            context "but is isn't for the next performance" do
              before do
                challenge.performance.update!(window_close: 2.days.ago, window_open: 3.days.ago)
              end

              it_behaves_like "variable non assignment"
            end
          end
        end

        context "current_discipline_action" do
          let(:variable) { :current_discipline_action }

          context "but the user doesn't have one" do
            it_behaves_like "variable non assignment"
          end

          context "and the user has one" do
            let(:discipline_action) { create(:discipline_action, user: current_user, performance: performance) }
            let!(:expected_value) { discipline_action }

            it_behaves_like "variable assignment"

            context "but it isn't for the next performance" do
              before do
                discipline_action.performance.update!(window_open: 3.days.ago, window_close: 2.days.ago)
              end

              it_behaves_like "variable non assignment"
            end
          end
        end

        context "challenges" do
          let(:variable) { :challenges }

          context "but the user doesn't have any" do
            let(:expected_value) { [] }
            it_behaves_like "variable assignment"
          end

          context "but none are in the done stage" do
            let(:challenge) { create(:normal_challenge, stage: :needs_comments) }
            let(:current_user) { challenge.users.first }
            let(:expected_value) { [] }

            before do
              challenge.performance.update!(window_open: 3.days.ago, window_close: 2.days.ago)
            end

            it_behaves_like "variable assignment"
          end

          context "but the only challenge is the current one" do
            let(:challenge) { create(:normal_challenge, stage: :needs_comments) }
            let(:current_user) { challenge.users.first }
            let(:expected_value) { [] }

            it_behaves_like "variable assignment"
          end

          context "and the user has a done challenge" do
            let(:challenge) { create(:normal_challenge, stage: :done) }
            let(:current_user) { challenge.users.first }
            let(:expected_value) { [challenge] }

            before do
              challenge.performance.update!(window_open: 3.days.ago, window_close: 2.days.ago)
            end

            it_behaves_like "variable assignment"
          end
        end
      end
    end
  end

  describe "POST create" do
    let(:password) { "password" }
    let(:user) { create(:admin_user, password: password) }
    let(:params) do
      {
        buck_id: user.buck_id,
        password: password
      }
    end
    let(:request) { post :create, params: params }
    let(:expected_authenticated_response) { redirect_to("/logged_in") }
    let(:expected_unauthenticated_response) { redirect_to("/logged_in") }

    it_behaves_like "controller_authentication"

    context "not authenticated" do
      context "with correct credentials" do
        it "redirects to /logged_in" do
          request
          expect(response).to redirect_to("/logged_in")
        end

        it "sets the session's buck_id" do
          request
          expect(controller.session[:buck_id]).to eq(user.buck_id)
        end
      end

      context "with incorrect credentials" do
        let(:params) do
          {
            buck_id: user.buck_id,
            password: password + "whoops"
          }
        end

        it "renders new again" do
          request
          expect(response).to render_template("new")
        end

        it "does not set the session's buck_id" do
          request
          expect(controller.session[:buck_id]).to be_nil
        end
      end
    end
  end

  describe "GET destroy" do
    let(:request) { get :destroy }
    let(:expected_authenticated_response) { redirect_to("/logged_in") }
    let(:expected_unauthenticated_response) { redirect_to("/login") }

    context "authenticated" do
      include_context "with authentication"

      it "clears the current session" do
        get :destroy
        expect(controller.session[:buck_id]).to be_nil
      end
    end
  end
end
