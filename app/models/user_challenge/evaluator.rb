class UserChallenge
  class Evaluator
    attr_reader :ids_to_comments, :ids_to_places, :user_challenge_ids

    def initialize(params:)
      permitted_params = params.permit(user_challenges: [:id, :comments, :place])

      @user_challenge_ids = permitted_params['user_challenges'].pluck(:id)
      @ids_to_comments = permitted_params['user_challenges'].each_with_object({}) do |val, acc|
        acc[val['id']] = val['comments']
        acc
      end
      @ids_to_places = permitted_params['user_challenges'].each_with_object({}) do |val, acc|
        acc[val['id']] = val['place']
        acc
      end
    end

    def save_comments
      save_a_field(field_name: :comments, id_map: ids_to_comments)
    end

    def save_places
      save_a_field(field_name: :place, id_map: ids_to_places)
    end

    private

    def save_a_field(field_name:, id_map:)
      user_challenges = UserChallenge.where(id: user_challenge_ids)

      UserChallenge.transaction do
        user_challenges.each do |user_challenge|
          user_challenge.update!(field_name => id_map[user_challenge.id])
        end
      end

      Result.success
    rescue StandardError
      Result.failure(errors: user_challenges.map(&:errors))
    end
  end
end
