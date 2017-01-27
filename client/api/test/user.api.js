/* eslint-env browser*/

function addUser() {
  return new Promise((fnResolve) => {
    fnResolve({
      success: true,
      data: {
        name: 'name',
        token: 'token',
        answers: '{}',
      },
    });
  });
}

function loginUser() {
  return new Promise((fnResolve) => {
    fnResolve({
      success: true,
      data: {
        name: 'name',
        token: 'token',
        answers: '{}',
      },
    });
  });
}

function loginUserFacebook() {
  return new Promise((fnResolve) => {
    fnResolve({
      success: true,
      data: {
        name: 'name',
        token: 'token',
        answers: '{}',
      },
    });
  });
}

function logoutUser() {
  return new Promise((fnResolve) => {
    fnResolve({
      success: true,
    });
  });
}

function updateUser() {
  return new Promise((fnResolve) => {
    fnResolve({
      token: 'token',
    });
  });
}

function updateAnswers() {
  return new Promise((fnResolve) => {
    fnResolve({
      token: 'token',
    });
  });
}

function updateUserGoals() {
  return new Promise((fnResolve) => {
    fnResolve({
      token: 'token',
    });
  });
}

function forgotPassword() {
  return new Promise((fnResolve) => {
    fnResolve({
      token: 'token',
    });
  });
}

function setLocation() {
  return new Promise((fnResolve) => {
    fnResolve({
      token: 'token',
    });
  });
}

function setPhoto() {
  return new Promise((fnResolve) => {
    fnResolve({
      token: 'token',
    });
  });
}

function listLeaders() {
  return new Promise((fnResolve) => {
    fnResolve({
      token: 'token',
    });
  });
}

function listLocations() {
  return new Promise((fnResolve) => {
    fnResolve({
      token: 'token',
    });
  });
}

function showProfile() {
  return new Promise((fnResolve) => {
    fnResolve({
      success: true,
      data: {
        city: 'city',
        county: 'county',
        first_name: 'first',
        household_size: 0,
        last_name: 'last',
        photo_url: '',
        profile_data: {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: '',
          medium: '',
          intro: '',
        },
        public: true,
        state: 'state',
        total_footprint: {
          result_food_total: 10,
          result_goods_total: 10,
          result_grand_total: 64,
          result_housing_total: 13,
          result_services_total: 9,
          result_shopping_total: 19,
          result_transport_total: 23,
        },
        user_goals: [{
          key: 'more_efficient_vehicle',
          status: 'pledged',
          tons_saved: -0.78,
          dollars_saved: 0,
          upfront_cost: 2000,
        }],
        user_id: 1,
      },
    });
  });
}

export { addUser,
  loginUser,
  loginUserFacebook,
  logoutUser,
  updateUser,
  updateAnswers,
  forgotPassword,
  setLocation,
  listLeaders,
  listLocations,
  showProfile,
  setPhoto,
  updateUserGoals,
};
