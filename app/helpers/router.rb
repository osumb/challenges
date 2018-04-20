module Router
  def self.route_groups_for_user(user) # rubocop:disable Metrics/MethodLength
    return [] unless user
    route_groups = [_challenges_routes(user.role)]

    case user.role
    when User::Roles::ADMIN, User::Roles::DIRECTOR
      route_groups << _results_routes(user.role)
      route_groups << _performance_routes(user.role)
      route_groups << _user_routes(user.role)
    when User::Roles::MEMBER, User::Roles::SQUAD_LEADER
      route_groups << _results_routes(user.role)
    else
      raise I18n.t!('errors.unexpected_value', variable_name: 'role', value: user.role)
    end
    route_groups
  end

  def self._challenges_routes(role)
    routes = [{ name: 'Make A Challenge', path: '/challenges/new' }]
    routes << { name: 'Evaluate', path: '/challenges/evaluate' } unless role == User::Roles::MEMBER

    _route_group('Challenges', routes)
  end

  def self._results_routes(role)
    routes = []
    routes << { name: 'Completed', path: '/results/completed' } unless role == User::Roles::MEMBER

    _route_group('Results', routes)
  end

  def self._performance_routes(role)
    routes = []
    if role == User::Roles::ADMIN
      routes << { name: 'All', path: '/performances' }
      routes << { name: 'Create', path: '/performances/new' }
    end

    _route_group('Performances', routes)
  end

  def self._user_routes(role)
    routes = []
    if role == User::Roles::ADMIN
      routes << { name: 'Search', path: '/search' }
      routes << { name: 'Roster', path: '/users' }
      routes << { name: 'Upload', path: '/users/upload' }
      routes << { name: 'Create', path: '/users/new' }
    end

    _route_group('Users', routes)
  end

  def self._route_group(name, routes)
    { display_name: name, routes: routes }
  end
end
