class Api::V1::UsersController < Api::V1::BaseController 
    before_action :authorized, only: [:auto_login]

  # REGISTER
  def create
    @user = User.create(user_params)
    if @user.valid?
      token = encode_token({user_id: @user.id})
      render json: {user: @user, token: token}
    else
      render json: {}, status: 401
    end
  end

  # LOGGING IN
  def login
    @user = User.find_by(email: params[:email])
    if @user && @user.authenticate(params[:password])
      token = encode_token({user_id: @user.id})
      render json: {user: @user, token: token}, :except => [:password_digest]
    else
      render json: {}, status: 401
    end
  end

  def update
     @user = User.find_by(email: params[:email])
    if @user && @user.authenticate(params[:password])
      @user.update_attributes(user_params) 
      render json:{ user: @user }, :except => [:password_digest]
    else
      render json: {}, status: 401
    end
  end

  def auto_login
    render json: @user
  end

  private

  def user_params
    params.permit(:id, :first_name, :last_name, :email, :password, :avatar, :govid)
  end

end
