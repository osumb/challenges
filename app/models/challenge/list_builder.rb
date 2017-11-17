require 'rubyXL'

class Challenge
  class ListBuilder
    def initialize(performance_id)
      @performance = Performance.find(performance_id)
      @challenges = @performance.challenges
      @discipline_actions = @performance.discipline_actions
      @date = Time.zone.now.strftime('%m-%d-%Y')
      @workbook = RubyXL::Workbook.new
      @worksheet = @workbook[0]
      @worksheet.sheet_name = "Challenge List #{@date}"
      @worksheet.add_cell(0, 0, "OSUMB Challenges #{@date}")
      @worksheet.add_cell(1, 0, 'Challenges')
      @list_built = false
    end

    # rubocop:disable Metrics/MethodLength
    def build_challenge_list
      challenge_rows = challenges_to_list_items
      discipline_action_rows = discipline_actions_to_rows(@discipline_actions)
      challenge_rows.each_with_index do |row, i|
        add_list_item_to_worksheet(i + 2, row)
      end
      add_list_item_to_worksheet(challenge_rows.length + 2, [])
      add_list_item_to_worksheet(challenge_rows.length + 3, ['Open Spots/Automatic Alternates'])
      discipline_action_rows.each_with_index do |row, i|
        add_list_item_to_worksheet(2 + challenge_rows.length + 2 + i, row)
      end
      @list_built = true
    end
    # rubocop:enable Metrics/MethodLength

    def write_list_to_buffer
      @workbook.stream
    end

    private

    def add_list_item_to_worksheet(row_number, item)
      item.to_a.each_with_index { |v, i| @worksheet.add_cell(row_number, i, v) }
    end

    def discipline_actions_to_rows(discipline_actions)
      discipline_actions.map { |da| discipline_action_to_list_row(da) }
    end

    def discipline_action_to_list_row(da)
      [da.user.current_spot.to_s, da.user.full_name, da.reason]
    end

    def challenges_to_list_items
      @challenges.map { |c| challenge_to_list_item(c) }.flatten.sort
    end

    def challenge_to_list_item(challenge)
      if challenge.normal_challenge_type?
        normal_challenge_to_list_item(challenge)
      elsif challenge.open_spot_challenge_type?
        open_spot_challenge_to_list_items(challenge)
      elsif challenge.tri_challenge_type?
        tri_challenge_to_list_item(challenge)
      else
        Raise 'Unsupported challenge type'
      end
    end

    def normal_challenge_to_list_item(challenge)
      challenger = challenge.user_challenges.reject { |uc| uc.spot == challenge.spot }.first.user
      challengee = challenge.users.reject { |u| u == challenger }.first
      ListItem.new(
        challenger_spots: [challenger.current_spot],
        challenger_names: [challenger.full_name],
        challenged_spot: challengee.current_spot,
        challenged_name: challengee.full_name
      )
    end

    def open_spot_challenge_to_list_items(challenge)
      challenge.user_challenges.sort_by(&:spot).map do |uc|
        ListItem.new(
          challenger_spots: [uc.spot],
          challenger_names: [uc.user.full_name],
          challenged_spot: challenge.spot,
          challenged_name: 'Open Spot'
        )
      end
    end

    # rubocop:disable Performance/CompareWithBlock, Metrics/LineLength
    def tri_challenge_to_list_item(challenge)
      challengers = challenge.user_challenges.reject { |uc| uc.spot == challenge.spot }.sort { |a, b| a.spot <=> b.spot }
      challengee = challenge.user_challenges.select { |uc| uc.spot == challenge.spot }.first
      ListItem.new(
        challenger_spots: challengers.map(&:spot),
        challenger_names: challengers.map { |uc| uc.user.first_name },
        challenged_spot: challengee.spot,
        challenged_name: challengee.user.full_name
      )
    end
    # rubocop:enable Performance/CompareWithBlock, Metrics/LineLength

    def create_challenge_list_dir
      return unless Dir.exist? tmp_dir
      FileUtils.mkdir_p tmp_dir
    end

    def tmp_dir
      Rails.root.join('tmp', 'challenge_lists')
    end
  end

  class ListItem
    attr_reader :challenger_spots

    def initialize(challenger_spots:, challenger_names:, challenged_spot:, challenged_name:)
      @challenger_spots = challenger_spots
      @challenger_names = challenger_names
      @challenged_spot = challenged_spot
      @challenged_name = challenged_name
    end

    def <=>(other)
      @challenger_spots.first <=> other.challenger_spots.first
    end

    def to_a
      spot_string = @challenger_spots.map(&:to_s).join(', ')
      name_string = @challenger_names.map(&:to_s).join(', ')
      [spot_string, name_string, @challenged_spot.to_s, @challenged_name]
    end
  end
end
