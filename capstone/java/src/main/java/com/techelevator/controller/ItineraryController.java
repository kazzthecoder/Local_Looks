package com.techelevator.controller;

import com.techelevator.dao.ItineraryDao;
import com.techelevator.dao.LandmarkDao;
import com.techelevator.dao.UserDao;
import com.techelevator.model.Itinerary;
import com.techelevator.model.Landmark;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@CrossOrigin
@RestController
@PreAuthorize("isAuthenticated()")
public class ItineraryController {

    private ItineraryDao itineraryDao;
    private UserDao userDao;
    private LandmarkDao landmarkDao;

    public ItineraryController(ItineraryDao itineraryDao, UserDao userDao,
                               LandmarkDao landmarkDao) {
        this.itineraryDao = itineraryDao;
        this.userDao = userDao;
        this.landmarkDao = landmarkDao;
    }

    @GetMapping(path = "/itineraries")
    public List<Itinerary> getItineraries (Principal principal){
        int userId = userDao.findIdByUsername(principal.getName());
            return itineraryDao.getItinerariesByUserId(userId);
    }

    @PostMapping(path = "/itineraries")
    public void createItinerary(@RequestBody Itinerary itinerary, Principal principal) {
        int userId = userDao.findIdByUsername(principal.getName());
        itineraryDao.createItinerary(itinerary.getItineraryName(),
                itinerary.getStartingPoint(),
                itinerary.getItineraryDate(),
                userId);
    }

    @PostMapping(path = "/itineraries/{itineraryId}/{landmarkId}")
    public void addLandmarkToItinerary(@PathVariable Integer itineraryId, @PathVariable Integer landmarkId) {

        itineraryDao.addLandmarkToItinerary(itineraryId, landmarkId);
    }

    @DeleteMapping (path = "/itineraries/{itineraryId}/{landmarkId}")
    public void deleteLandmarkFromItinerary(@PathVariable Integer itineraryId, @PathVariable Integer landmarkId) {

        Itinerary itinerary = itineraryDao.getItineraryById(itineraryId);
        Landmark landmark = landmarkDao.getLandmarksById(landmarkId);
    }
}
