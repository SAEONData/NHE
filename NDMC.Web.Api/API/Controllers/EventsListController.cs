﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ND3B_API.ControllerLogic;

namespace ND3B_API.Controllers
{
    [Produces("application/json")]
    [Route("api/Events")]
    public class EventsListController : Controller
    {
        private readonly EventsListControllerLogic _logic;

        public EventsListController()
        {
            _logic = new EventsListControllerLogic();
        }

        [Route("Test")]
        public string Test()
        {
            return "EVENTS";
        }

        public string Get()
        {
            return "GET";
        }
    }
}