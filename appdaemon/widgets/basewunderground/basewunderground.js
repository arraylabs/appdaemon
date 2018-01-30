function basewunderground(widget_id, url, skin, parameters) {
  // Will be using "self" throughout for the various flavors of "this"
  // so for consistency ...

  self = this;

  self.weather_icons = {
    "chanceflurries": '&#xe016',
    "chancerain": '&#xe004',
    "chancesleet": '&#xe010',
    "chancesnow": '&#xe019',
    "chancetstorms": '&#xe026',
    "clear": '&#xe028',
    "cloudy": '&#xe000',
    "flurries": '&#xe015',
    "fog": '&#xe01c',
    "hazy": '&#xe01f',
    "mostlycloudy": '&#xe000',
    "mostlysunny": '&#xe028',
    "partlycloudy": '&#xe001',
    "partlysunny": '&#xe028',
    "sleet": '&#xe010',
    "rain": '&#xe004',
    "snow": '&#xe019',
    "sunny": '&#xe028',
    "tstorms": '&#xe026',
    "nt_chanceflurries": '&#xe017',
    "nt_chancerain": '&#xe005',
    "nt_chancesleet": '&#xe011',
    "nt_chancesnow": '&#xe01a',
    "nt_chancetstorms": '&#xe027',
    "nt_clear": '&#xe02d',
    "nt_cloudy": '&#xe000',
    "nt_flurries": '&#xe015',
    "nt_fog": '&#xe01d',
    "nt_hazy": '&#xe020',
    "nt_mostlycloudy": '&#xe000',
    "nt_mostlysunny": '&#xe02d',
    "nt_partlycloudy": '&#xe002',
    "nt_partlysunny": '&#xe02d',
    "nt_sleet": '&#xe011',
    "nt_rain": '&#xe005',
    "nt_snow": '&#xe01a',
    "nt_sunny": '&#xe028',
    "nt_tstorms": '&#xe027',
    "unknown": ''
  };

  // Initialization

  self.widget_id = widget_id;

  // Store on brightness or fallback to a default

  // Parameters may come in useful later on

  self.parameters = parameters;

  var callbacks = [];

  // Define callbacks for entities - this model allows a widget to monitor multiple entities if needed
  // Initial will be called when the dashboard loads and state has been gathered for the entity
  // Update will be called every time an update occurs for that entity

  self.OnUpdate = OnUpdate;

  title = parameters.title;

  //just using _f entities as HA converts C to F or F to C and wunderground shows the same conversion on both C and F
  var monitored_entities = [{
    "entity": "sensor.pws_temp_f",
    "initial": self.OnUpdate,
    "update": self.OnUpdate
  }, {
    "entity": "sensor.pws_precip_1d",
    "initial": self.OnUpdate,
    "update": self.OnUpdate
  }, {
    "entity": "sensor.pws_precip_2d",
    "initial": self.OnUpdate,
    "update": self.OnUpdate
  }, {
    "entity": "sensor.pws_weather",
    "initial": self.OnUpdate,
    "update": self.OnUpdate
  }, {
    "entity": "sensor.pws_weather_2d",
    "initial": self.OnUpdate,
    "update": self.OnUpdate
  }, {
    "entity": "sensor.pws_temp_high_1d_f",
    "initial": self.OnUpdate,
    "update": self.OnUpdate
  }, {
    "entity": "sensor.pws_temp_low_1d_f",
    "initial": self.OnUpdate,
    "update": self.OnUpdate
  }, {
    "entity": "sensor.pws_temp_high_2d_f",
    "initial": self.OnUpdate,
    "update": self.OnUpdate
  }, {
    "entity": "sensor.pws_temp_low_2d_f",
    "initial": self.OnUpdate,
    "update": self.OnUpdate
  }];

  // Finally, call the parent constructor to get things moving

  WidgetBase.call(self, widget_id, url, skin, parameters, monitored_entities,
    callbacks);

  // Function Definitions

  // The StateAvailable function will be called when
  // self.state[<entity>] has valid information for the requested entity
  // state is the initial state
  // Methods

  function OnUpdate(self, state) {
    if (state.entity_id == "sensor.pws_temp_f") {
      self.set_field(self, "temperature", state.state);
      self.set_field(self, "unit", state.attributes.unit_of_measurement)
      self.set_field(self, "small_unit", state.attributes.unit_of_measurement.split(
        "F")[0])
    }
    if (state.entity_id == "sensor.pws_precip_1d") {
      self.set_field(self, "today_prec_icon", "mdi mdi-" + state.attributes.icon
        .split(":")[1]);
    }
    if (state.entity_id == "sensor.pws_precip_2d") {
      self.set_field(self, "tomorrow_prec_icon", "mdi mdi-" + state.attributes.icon
        .split(":")[1]);
    }
    if (state.entity_id == "sensor.pws_temp_high_1d_f") {
      self.set_field(self, "today_high", state.state);
    }
    if (state.entity_id == "sensor.pws_temp_low_1d_f") {
      self.set_field(self, "today_low", state.state);
    }
    if (state.entity_id == "sensor.pws_temp_high_2d_f") {
      self.set_field(self, "tomorrow_high", state.state);
    }
    if (state.entity_id == "sensor.pws_temp_low_2d_f") {
      self.set_field(self, "tomorrow_low", state.state);
    }
    set_view(self, state)
  }

  function set_view(self, state) {
    if (state.entity_id == "sensor.pws_weather") {
      self.set_field(self, "today_icon", self.weather_icons[state.attributes.entity_picture
        .split("/")[6].split(".")[0]])
    } else if (state.entity_id == "sensor.pws_weather_2d") {
      self.set_field(self, "tomorrow_icon", self.weather_icons[state.attributes
        .entity_picture.split("/")[6].split(".")[0]])
    } else {
      var field = state.entity_id.split(".")[1];
      self.set_field(self, field, state.state);
    }
  }
}
