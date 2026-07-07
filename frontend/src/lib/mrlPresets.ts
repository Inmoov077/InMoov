/**
 * MyRobotLab 1.1.1610 InMoov2 gestures — auto-extracted from local install.
 * Regenerate: python scripts/extract_mrl_inmoov.py
 */
import type { PresetKeyframe } from '@/lib/presets';

export type MrlPresetCategory = 'head' | 'arm' | 'hand' | 'full' | 'social';

export interface MrlPresetMeta {
  id: string;
  name: string;
  desc: string;
  icon: string;
  category: MrlPresetCategory;
  mrlName: string;
}

export const MRL_PRESETS: Record<string, PresetKeyframe[]> = {
  'mrl-Yes':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 90,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 120,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 70,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-No':   [
    {
      "hneck": 130,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 50,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 130,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-lookleftside':   [
    {
      "hneck": 85,
      "eye": 160,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 20,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 175,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 10,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 170,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 70,
      "hold": 400
    }
  ],
  'mrl-lookrightside':   [
    {
      "hneck": 90,
      "eye": 20,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 164,
      "hold": 400
    }
  ],
  'mrl-lookup':   [
    {
      "hneck": 160,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-lookdown':   [
    {
      "hneck": 20,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-tiltHeadAgree':   [
    {
      "hneck": 80,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 70,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 800
    }
  ],
  'mrl-tiltHeadRightSide':   [
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 159,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    }
  ],
  'mrl-raiserightarm':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 57,
        "lift": 51,
        "rotate": 90,
        "elbow": 30,
        "wrist": 33
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 177
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-raiseleftarm':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 53,
        "lift": 57,
        "rotate": 90,
        "elbow": 37,
        "wrist": 31
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "leftHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-shakehand':   [
    {
      "hneck": 39,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 16,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 6,
        "lift": 73,
        "rotate": 90,
        "elbow": 55,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 50,
        "index": 50,
        "middle": 40,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 50,
        "index": 40,
        "middle": 40,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 55,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 6000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 16,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 6,
        "lift": 73,
        "rotate": 90,
        "elbow": 55,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 50,
        "index": 50,
        "middle": 40,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 55,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 80,
        "index": 70,
        "middle": 70,
        "ring": 50,
        "pinky": 50
      }
    },
    {
      "hneck": 39,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 16,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 6,
        "lift": 73,
        "rotate": 90,
        "elbow": 55,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 50,
        "index": 50,
        "middle": 40,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 55,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 70,
      "eye": 53,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 39,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 200
    },
    {
      "hneck": 70,
      "eye": 53,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 200
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 16,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 6,
        "lift": 73,
        "rotate": 90,
        "elbow": 55,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 50,
        "index": 50,
        "middle": 40,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 55,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-victory':   [
    {
      "hneck": 114,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 91,
        "rotate": 90,
        "elbow": 106,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 0,
        "lift": 73,
        "rotate": 90,
        "elbow": 30,
        "wrist": 17
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 170,
        "index": 0,
        "middle": 0,
        "ring": 168,
        "pinky": 167
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 166
      },
      "rightHand": {
        "thumb": 98,
        "index": 37,
        "middle": 34,
        "ring": 67,
        "pinky": 118
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-shrug':   [
    {
      "hneck": 80,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 26,
        "lift": 105,
        "rotate": 90,
        "elbow": 30,
        "wrist": 25
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 37,
        "lift": 124,
        "rotate": 90,
        "elbow": 30,
        "wrist": 27
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    }
  ],
  'mrl-presentation':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 64,
        "lift": 94,
        "rotate": 90,
        "elbow": 10,
        "wrist": 10
      }
    },
    {
      "hneck": 65,
      "eye": 66,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 64,
        "lift": 104,
        "rotate": 90,
        "elbow": 10,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 44,
        "lift": 84,
        "rotate": 90,
        "elbow": 10,
        "wrist": 11
      }
    },
    {
      "hneck": 75,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 54,
        "lift": 104,
        "rotate": 90,
        "elbow": 10,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 64,
        "lift": 84,
        "rotate": 90,
        "elbow": 10,
        "wrist": 20
      }
    },
    {
      "hneck": 65,
      "eye": 96,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 44,
        "lift": 94,
        "rotate": 90,
        "elbow": 10,
        "wrist": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 54,
        "lift": 94,
        "rotate": 90,
        "elbow": 20,
        "wrist": 11
      }
    },
    {
      "hneck": 75,
      "eye": 76,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 64,
        "lift": 94,
        "rotate": 90,
        "elbow": 20,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 34,
        "lift": 94,
        "rotate": 90,
        "elbow": 10,
        "wrist": 11
      }
    },
    {
      "hneck": 65,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 24,
        "lift": 94,
        "rotate": 90,
        "elbow": 10,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 24,
        "lift": 94,
        "rotate": 90,
        "elbow": 10,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 20,
        "wrist": 30
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 24,
        "lift": 124,
        "rotate": 90,
        "elbow": 10,
        "wrist": 20
      }
    },
    {
      "hneck": 75,
      "eye": 96,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 24,
        "lift": 104,
        "rotate": 90,
        "elbow": 10,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 20,
        "wrist": 30
      }
    },
    {
      "hneck": 75,
      "eye": 96,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 10,
        "wrist": 11
      }
    }
  ],
  'mrl-giving':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 15,
        "lift": 55,
        "rotate": 90,
        "elbow": 68,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 13,
        "lift": 40,
        "rotate": 90,
        "elbow": 74,
        "wrist": 13
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "leftHand": {
        "thumb": 61,
        "index": 0,
        "middle": 14,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 25
      },
      "rightHand": {
        "thumb": 0,
        "index": 24,
        "middle": 24,
        "ring": 19,
        "pinky": 21
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 44,
      "eye": 82,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 15,
        "lift": 55,
        "rotate": 90,
        "elbow": 68,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 13,
        "lift": 40,
        "rotate": 90,
        "elbow": 74,
        "wrist": 13
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "leftHand": {
        "thumb": 61,
        "index": 0,
        "middle": 14,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 25
      },
      "rightHand": {
        "thumb": 0,
        "index": 24,
        "middle": 24,
        "ring": 19,
        "pinky": 21
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-comehere':   [
    {
      "hneck": 80,
      "eye": 66,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 166,
      "hold": 400
    },
    {
      "hneck": 80,
      "eye": 110,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 73,
      "hold": 3000
    },
    {
      "hneck": 80,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 123,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 7,
        "lift": 74,
        "rotate": 90,
        "elbow": 92,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 180,
        "index": 2,
        "middle": 175,
        "ring": 160,
        "pinky": 165
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 80,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 4500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 48,
        "lift": 74,
        "rotate": 90,
        "elbow": 92,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 20
      },
      "rightHand": {
        "thumb": 180,
        "index": 2,
        "middle": 175,
        "ring": 160,
        "pinky": 165
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 80,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 20
      },
      "rightHand": {
        "thumb": 180,
        "index": 164,
        "middle": 175,
        "ring": 160,
        "pinky": 165
      }
    },
    {
      "hneck": 80,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 20
      },
      "rightHand": {
        "thumb": 180,
        "index": 2,
        "middle": 175,
        "ring": 160,
        "pinky": 165
      }
    },
    {
      "hneck": 118,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 20
      },
      "rightHand": {
        "thumb": 180,
        "index": 164,
        "middle": 175,
        "ring": 160,
        "pinky": 165
      }
    },
    {
      "hneck": 60,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 20
      },
      "rightHand": {
        "thumb": 180,
        "index": 2,
        "middle": 175,
        "ring": 160,
        "pinky": 165
      }
    },
    {
      "hneck": 118,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 20
      },
      "rightHand": {
        "thumb": 180,
        "index": 164,
        "middle": 175,
        "ring": 160,
        "pinky": 165
      }
    }
  ],
  'mrl-agreeanswersmall':   [
    {
      "hneck": 20,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 8,
        "lift": 82,
        "rotate": 90,
        "elbow": 28,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 8,
        "lift": 82,
        "rotate": 90,
        "elbow": 28,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 60,
        "index": 60,
        "middle": 65,
        "ring": 81,
        "pinky": 41
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 60,
        "index": 60,
        "middle": 18,
        "ring": 61,
        "pinky": 36
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    }
  ],
  'mrl-fistHips':   [
    {
      "hneck": 138,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 79,
        "lift": 42,
        "rotate": 90,
        "elbow": 23,
        "wrist": 41
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 71,
        "lift": 40,
        "rotate": 90,
        "elbow": 14,
        "wrist": 39
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 47
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 99,
        "index": 130,
        "middle": 152,
        "ring": 154,
        "pinky": 145
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 138,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 79,
        "lift": 45,
        "rotate": 90,
        "elbow": 23,
        "wrist": 41
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 71,
        "lift": 40,
        "rotate": 90,
        "elbow": 14,
        "wrist": 39
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 47
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 99,
        "index": 130,
        "middle": 152,
        "ring": 154,
        "pinky": 145
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-armsUp':   [
    {
      "hneck": 180,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 33
      },
      "leftHand": {
        "thumb": 170,
        "index": 170,
        "middle": 170,
        "ring": 170,
        "pinky": 170
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 170,
        "index": 170,
        "middle": 170,
        "ring": 170,
        "pinky": 170
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000,
      "leftArm": {
        "shoulder": 90,
        "lift": 90,
        "rotate": 90,
        "elbow": 170,
        "wrist": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 90,
        "rotate": 90,
        "elbow": 173,
        "wrist": 20
      }
    },
    {
      "hneck": 180,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 9000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 170,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 173,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 33
      },
      "leftHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-surrender':   [
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 139,
        "rotate": 90,
        "elbow": 15,
        "wrist": 79
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 145,
        "rotate": 90,
        "elbow": 37,
        "wrist": 79
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 76
      },
      "leftHand": {
        "thumb": 50,
        "index": 28,
        "middle": 30,
        "ring": 10,
        "pinky": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 139
      },
      "rightHand": {
        "thumb": 10,
        "index": 10,
        "middle": 10,
        "ring": 10,
        "pinky": 10
      }
    }
  ],
  'mrl-muscle':   [
    {
      "hneck": 90,
      "eye": 129,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 139,
        "rotate": 90,
        "elbow": 48,
        "wrist": 75
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 71,
        "lift": 40,
        "rotate": 90,
        "elbow": 14,
        "wrist": 43
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 148
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 99,
        "index": 130,
        "middle": 152,
        "ring": 154,
        "pinky": 145
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 90,
      "tilt": 60,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 45,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 44,
        "lift": 46,
        "rotate": 90,
        "elbow": 20,
        "wrist": 39
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 145,
        "rotate": 90,
        "elbow": 58,
        "wrist": 74
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 83
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 21
      },
      "rightHand": {
        "thumb": 99,
        "index": 130,
        "middle": 152,
        "ring": 154,
        "pinky": 145
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 30,
      "tilt": 35,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-relax':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000,
      "leftArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 25,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 25,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 25
      },
      "leftHand": {
        "thumb": 92,
        "index": 33,
        "middle": 37,
        "ring": 71,
        "pinky": 66
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 160
      },
      "rightHand": {
        "thumb": 81,
        "index": 66,
        "middle": 82,
        "ring": 60,
        "pinky": 23
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 79,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 102,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 25,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 25,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 25
      },
      "leftHand": {
        "thumb": 92,
        "index": 33,
        "middle": 37,
        "ring": 71,
        "pinky": 66
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 160
      },
      "rightHand": {
        "thumb": 81,
        "index": 66,
        "middle": 82,
        "ring": 60,
        "pinky": 23
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-CloseBothHandSlow':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1200,
      "leftArm": {
        "shoulder": 60,
        "lift": 75,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 60,
        "lift": 75,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 50,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 150
      },
      "leftHand": {
        "thumb": 50,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 20,
      "eye": 110,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 123,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 60,
        "lift": 55,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 60,
        "lift": 55,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 47,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 300,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 180,
        "index": 130,
        "middle": 120,
        "ring": 140,
        "pinky": 160
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 150
      },
      "leftHand": {
        "thumb": 180,
        "index": 130,
        "middle": 120,
        "ring": 140,
        "pinky": 160
      }
    }
  ],
  'mrl-LookAtTheSky':   [
    {
      "hneck": 180,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 5000
    }
  ],
  'mrl-Torso':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 30,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 90,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    }
  ],
  'mrl-YesName':   [
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 159,
      "hold": 5000
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 76,
      "hold": 1300
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    }
  ],
  'mrl-about':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 64,
        "lift": 94,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 65,
      "eye": 66,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 64,
        "lift": 104,
        "rotate": 90,
        "elbow": 30,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 44,
        "lift": 84,
        "rotate": 90,
        "elbow": 30,
        "wrist": 11
      }
    },
    {
      "hneck": 75,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 54,
        "lift": 104,
        "rotate": 90,
        "elbow": 30,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 64,
        "lift": 84,
        "rotate": 90,
        "elbow": 30,
        "wrist": 20
      }
    },
    {
      "hneck": 65,
      "eye": 96,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 44,
        "lift": 94,
        "rotate": 90,
        "elbow": 30,
        "wrist": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 54,
        "lift": 94,
        "rotate": 90,
        "elbow": 40,
        "wrist": 11
      }
    },
    {
      "hneck": 75,
      "eye": 76,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 64,
        "lift": 94,
        "rotate": 90,
        "elbow": 40,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 34,
        "lift": 94,
        "rotate": 90,
        "elbow": 30,
        "wrist": 11
      }
    },
    {
      "hneck": 65,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 24,
        "lift": 94,
        "rotate": 90,
        "elbow": 30,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 24,
        "lift": 94,
        "rotate": 90,
        "elbow": 30,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 40,
        "wrist": 30
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 24,
        "lift": 124,
        "rotate": 90,
        "elbow": 30,
        "wrist": 20
      }
    },
    {
      "hneck": 75,
      "eye": 96,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 24,
        "lift": 104,
        "rotate": 90,
        "elbow": 30,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 40,
        "wrist": 30
      }
    },
    {
      "hneck": 75,
      "eye": 96,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 30,
        "wrist": 11
      }
    }
  ],
  'mrl-agreeanswer':   [
    {
      "hneck": 120,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 20,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500,
      "leftArm": {
        "shoulder": 20,
        "lift": 93,
        "rotate": 90,
        "elbow": 42,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 20,
        "lift": 93,
        "rotate": 90,
        "elbow": 37,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 143
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 65,
        "ring": 81,
        "pinky": 41
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 21
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 18,
        "ring": 61,
        "pinky": 36
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    }
  ],
  'mrl-alessandro':   [
    {
      "hneck": 60,
      "eye": 40,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 166,
      "hold": 400
    },
    {
      "hneck": 80,
      "eye": 40,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 166,
      "hold": 1000
    },
    {
      "hneck": 100,
      "eye": 40,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 166,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 85,
        "lift": 106,
        "rotate": 90,
        "elbow": 25,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 87,
        "lift": 107,
        "rotate": 90,
        "elbow": 32,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 145
      },
      "leftHand": {
        "thumb": 110,
        "index": 62,
        "middle": 56,
        "ring": 88,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 27
      },
      "rightHand": {
        "thumb": 78,
        "index": 88,
        "middle": 101,
        "ring": 95,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 80,
      "eye": 40,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 166,
      "hold": 400
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 126,
      "hold": 1000
    }
  ],
  'mrl-approach':   [
    {
      "hneck": 92,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 7,
        "lift": 76,
        "rotate": 90,
        "elbow": 24,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 7,
        "lift": 79,
        "rotate": 90,
        "elbow": 24,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 80
      },
      "leftHand": {
        "thumb": 49,
        "index": 43,
        "middle": 30,
        "ring": 28,
        "pinky": 40
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 108
      },
      "rightHand": {
        "thumb": 55,
        "index": 7,
        "middle": 55,
        "ring": 48,
        "pinky": 43
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 92,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 52,
        "rotate": 90,
        "elbow": 57,
        "wrist": 13
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 10,
        "lift": 45,
        "rotate": 90,
        "elbow": 59,
        "wrist": 13
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 134,
        "index": 138,
        "middle": 176,
        "ring": 175,
        "pinky": 130
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 119,
        "index": 150,
        "middle": 163,
        "ring": 134,
        "pinky": 151
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 92,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 14,
        "lift": 63,
        "rotate": 90,
        "elbow": 71,
        "wrist": 21
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 14,
        "lift": 55,
        "rotate": 90,
        "elbow": 77,
        "wrist": 21
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 171
      },
      "leftHand": {
        "thumb": 49,
        "index": 43,
        "middle": 30,
        "ring": 28,
        "pinky": 40
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 12
      },
      "rightHand": {
        "thumb": 55,
        "index": 7,
        "middle": 55,
        "ring": 48,
        "pinky": 43
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 92,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 52,
        "rotate": 90,
        "elbow": 57,
        "wrist": 13
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 10,
        "lift": 45,
        "rotate": 90,
        "elbow": 59,
        "wrist": 13
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 134,
        "index": 138,
        "middle": 176,
        "ring": 175,
        "pinky": 130
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 119,
        "index": 150,
        "middle": 163,
        "ring": 134,
        "pinky": 151
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-approachlefthand':   [
    {
      "hneck": 20,
      "eye": 84,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 67,
        "lift": 52,
        "rotate": 90,
        "elbow": 62,
        "wrist": 23
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 55,
        "lift": 61,
        "rotate": 90,
        "elbow": 45,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 130,
        "index": 0,
        "middle": 40,
        "ring": 10,
        "pinky": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 180,
        "index": 145,
        "middle": 145,
        "ring": 3,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 45,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-areyoualright':   [
    {
      "hneck": 90,
      "eye": 60,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 120,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 90,
      "eye": 60,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 700
    },
    {
      "hneck": 90,
      "eye": 120,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 700
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 700
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 700,
      "leftArm": {
        "shoulder": 85,
        "lift": 93,
        "rotate": 90,
        "elbow": 42,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 87,
        "lift": 93,
        "rotate": 90,
        "elbow": 37,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 143
      },
      "leftHand": {
        "thumb": 124,
        "index": 82,
        "middle": 65,
        "ring": 81,
        "pinky": 41
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 21
      },
      "rightHand": {
        "thumb": 59,
        "index": 53,
        "middle": 89,
        "ring": 61,
        "pinky": 36
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 200
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000,
      "leftArm": {
        "shoulder": 85,
        "lift": 93,
        "rotate": 90,
        "elbow": 42,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 87,
        "lift": 93,
        "rotate": 90,
        "elbow": 37,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 143
      },
      "leftHand": {
        "thumb": 124,
        "index": 82,
        "middle": 65,
        "ring": 81,
        "pinky": 41
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 21
      },
      "rightHand": {
        "thumb": 59,
        "index": 53,
        "middle": 89,
        "ring": 61,
        "pinky": 36
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 200
    }
  ],
  'mrl-armLeftSide':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 0,
        "lift": 118,
        "rotate": 90,
        "elbow": 29,
        "wrist": 74
      }
    }
  ],
  'mrl-armRightSide':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 0,
        "lift": 118,
        "rotate": 90,
        "elbow": 29,
        "wrist": 74
      }
    }
  ],
  'mrl-armsFront':   [
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 13,
        "lift": 115,
        "rotate": 90,
        "elbow": 100,
        "wrist": 50
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 13,
        "lift": 115,
        "rotate": 90,
        "elbow": 100,
        "wrist": 50
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 50,
        "index": 24,
        "middle": 54,
        "ring": 50,
        "pinky": 82
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 50,
        "index": 24,
        "middle": 54,
        "ring": 50,
        "pinky": 82
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-balance':   [
    {
      "hneck": 79,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 124,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 25
      },
      "leftHand": {
        "thumb": 92,
        "index": 33,
        "middle": 37,
        "ring": 71,
        "pinky": 66
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 113
      },
      "rightHand": {
        "thumb": 81,
        "index": 66,
        "middle": 82,
        "ring": 60,
        "pinky": 105
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 80,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 124,
      "hold": 4000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 75,
        "lift": 123,
        "rotate": 90,
        "elbow": 52,
        "wrist": 45
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 75,
        "lift": 123,
        "rotate": 90,
        "elbow": 52,
        "wrist": 45
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 30
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 170
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 16,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 124,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 75,
        "lift": 97,
        "rotate": 90,
        "elbow": 52,
        "wrist": 45
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 75,
        "lift": 76,
        "rotate": 90,
        "elbow": 52,
        "wrist": 45
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 30
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 170
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 131,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 70,
      "eye": 120,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 124,
      "hold": 2500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 65,
        "lift": 119,
        "rotate": 90,
        "elbow": 52,
        "wrist": 45
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 75,
        "lift": 76,
        "rotate": 90,
        "elbow": 52,
        "wrist": 45
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 30
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 170
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 0,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-beforehappy':   [
    {
      "hneck": 84,
      "eye": 88,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 36,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 74,
        "lift": 112,
        "rotate": 90,
        "elbow": 61,
        "wrist": 29
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 0,
        "index": 88,
        "middle": 135,
        "ring": 94,
        "pinky": 96
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 81,
        "index": 79,
        "middle": 118,
        "ring": 47,
        "pinky": 0
      }
    }
  ],
  'mrl-bookcat':   [
    {
      "hneck": 20,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 153,
      "hold": 2000
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 120,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 153,
      "hold": 2000
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    }
  ],
  'mrl-brake':   [
    {
      "hneck": 80,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 45,
        "index": 40,
        "middle": 30,
        "ring": 25,
        "pinky": 35
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 55,
        "index": 2,
        "middle": 50,
        "ring": 48,
        "pinky": 30
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 20,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 21,
        "lift": 92,
        "rotate": 90,
        "elbow": 49,
        "wrist": 22
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 38,
        "lift": 91,
        "rotate": 90,
        "elbow": 43,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 45,
        "index": 40,
        "middle": 30,
        "ring": 25,
        "pinky": 35
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 89,
        "index": 127,
        "middle": 123,
        "ring": 48,
        "pinky": 30
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 20,
      "eye": 106,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 75,
        "lift": 69,
        "rotate": 90,
        "elbow": 49,
        "wrist": 22
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 38,
        "lift": 91,
        "rotate": 90,
        "elbow": 43,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 120,
        "index": 80,
        "middle": 74,
        "ring": 106,
        "pinky": 35
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 89,
        "index": 127,
        "middle": 123,
        "ring": 48,
        "pinky": 30
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 20,
      "eye": 93,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 75,
        "lift": 69,
        "rotate": 90,
        "elbow": 49,
        "wrist": 22
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 71,
        "lift": 66,
        "rotate": 90,
        "elbow": 60,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 120,
        "index": 80,
        "middle": 74,
        "ring": 106,
        "pinky": 35
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 146
      },
      "rightHand": {
        "thumb": 89,
        "index": 127,
        "middle": 123,
        "ring": 48,
        "pinky": 30
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-call_911':   [
    {
      "hneck": 120,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 20,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500,
      "leftArm": {
        "shoulder": 20,
        "lift": 93,
        "rotate": 90,
        "elbow": 42,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 20,
        "lift": 93,
        "rotate": 90,
        "elbow": 37,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 143
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 65,
        "ring": 81,
        "pinky": 41
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 21
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 18,
        "ring": 61,
        "pinky": 36
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    }
  ],
  'mrl-canyougivemethetime':   [
    {
      "hneck": 20,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 123,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 47,
        "lift": 86,
        "rotate": 90,
        "elbow": 41,
        "wrist": 14
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 72
      },
      "rightHand": {
        "thumb": 20,
        "index": 40,
        "middle": 40,
        "ring": 30,
        "pinky": 30
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 20,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 123,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 47,
        "lift": 86,
        "rotate": 90,
        "elbow": 41,
        "wrist": 14
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 60,
        "lift": 82,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 156
      },
      "rightHand": {
        "thumb": 138,
        "index": 40,
        "middle": 180,
        "ring": 145,
        "pinky": 139
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 20,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 123,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 47,
        "lift": 86,
        "rotate": 90,
        "elbow": 41,
        "wrist": 14
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 67,
        "lift": 40,
        "rotate": 90,
        "elbow": 47,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 156
      },
      "rightHand": {
        "thumb": 138,
        "index": 40,
        "middle": 180,
        "ring": 145,
        "pinky": 139
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 20,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 123,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 14,
        "lift": 86,
        "rotate": 90,
        "elbow": 55,
        "wrist": 14
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 67,
        "lift": 40,
        "rotate": 90,
        "elbow": 47,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 156
      },
      "rightHand": {
        "thumb": 138,
        "index": 40,
        "middle": 180,
        "ring": 145,
        "pinky": 139
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-carrybaby':   [
    {
      "hneck": 18,
      "eye": 111,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 123,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 81,
        "lift": 50,
        "rotate": 90,
        "elbow": 45,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 78,
        "lift": 44,
        "rotate": 90,
        "elbow": 50,
        "wrist": 31
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 25
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 86
      },
      "rightHand": {
        "thumb": 111,
        "index": 128,
        "middle": 140,
        "ring": 151,
        "pinky": 169
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-catchBall':   [
    {
      "hneck": 20,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 109,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 30,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 40,
        "lift": 73,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 53,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 300,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 100,
        "index": 50,
        "middle": 40,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 150,
        "index": 90,
        "middle": 120,
        "ring": 160,
        "pinky": 160
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1200,
      "leftArm": {
        "shoulder": 30,
        "lift": 73,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 60,
        "lift": 75,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 150,
        "index": 90,
        "middle": 120,
        "ring": 160,
        "pinky": 160
      }
    }
  ],
  'mrl-catchBallLeft':   [
    {
      "hneck": 20,
      "eye": 110,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 109,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 30,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 40,
        "lift": 73,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 47,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 300,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 100,
        "index": 50,
        "middle": 40,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 150
      },
      "leftHand": {
        "thumb": 180,
        "index": 160,
        "middle": 160,
        "ring": 160,
        "pinky": 160
      }
    }
  ],
  'mrl-catchBallRight':   [
    {
      "hneck": 20,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 109,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 30,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 40,
        "lift": 73,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 53,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 300,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 100,
        "index": 50,
        "middle": 40,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 180,
        "index": 160,
        "middle": 160,
        "ring": 160,
        "pinky": 160
      }
    }
  ],
  'mrl-christmasCarols':   [
    {
      "hneck": 80,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 139,
        "rotate": 90,
        "elbow": 15,
        "wrist": 79
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 145,
        "rotate": 90,
        "elbow": 37,
        "wrist": 79
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 76
      },
      "leftHand": {
        "thumb": 50,
        "index": 28,
        "middle": 30,
        "ring": 10,
        "pinky": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 139
      },
      "rightHand": {
        "thumb": 10,
        "index": 10,
        "middle": 10,
        "ring": 10,
        "pinky": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 118,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 118,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 139,
        "rotate": 90,
        "elbow": 15,
        "wrist": 70
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 145,
        "rotate": 90,
        "elbow": 37,
        "wrist": 70
      }
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 125,
        "rotate": 90,
        "elbow": 15,
        "wrist": 79
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 135,
        "rotate": 90,
        "elbow": 37,
        "wrist": 79
      }
    },
    {
      "hneck": 118,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 139,
        "rotate": 90,
        "elbow": 15,
        "wrist": 79
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 145,
        "rotate": 90,
        "elbow": 37,
        "wrist": 79
      }
    },
    {
      "hneck": 118,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 700
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 139,
        "rotate": 90,
        "elbow": 15,
        "wrist": 70
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 145,
        "rotate": 90,
        "elbow": 37,
        "wrist": 70
      }
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 125,
        "rotate": 90,
        "elbow": 15,
        "wrist": 79
      }
    }
  ],
  'mrl-closelefthand':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    }
  ],
  'mrl-closerighthand':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    }
  ],
  'mrl-cyclegesture3':   [
    {
      "hneck": 50,
      "eye": 110,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 88,
        "lift": 90,
        "rotate": 90,
        "elbow": 70,
        "wrist": 23
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 73,
        "lift": 90,
        "rotate": 90,
        "elbow": 70,
        "wrist": 27
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 50,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 88,
        "lift": 90,
        "rotate": 90,
        "elbow": 75,
        "wrist": 28
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 80,
        "lift": 90,
        "rotate": 90,
        "elbow": 76,
        "wrist": 21
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 40,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 82,
        "rotate": 90,
        "elbow": 70,
        "wrist": 23
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 80,
        "lift": 82,
        "rotate": 90,
        "elbow": 68,
        "wrist": 27
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 50,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 88,
        "lift": 90,
        "rotate": 90,
        "elbow": 70,
        "wrist": 28
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 75,
        "lift": 90,
        "rotate": 90,
        "elbow": 76,
        "wrist": 21
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 10
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 170
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-daVinci':   [
    {
      "hneck": 80,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 0,
        "lift": 118,
        "rotate": 90,
        "elbow": 29,
        "wrist": 74
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 0,
        "lift": 118,
        "rotate": 90,
        "elbow": 29,
        "wrist": 74
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 47
      },
      "leftHand": {
        "thumb": 50,
        "index": 40,
        "middle": 30,
        "ring": 20,
        "pinky": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 137
      },
      "rightHand": {
        "thumb": 50,
        "index": 40,
        "middle": 30,
        "ring": 20,
        "pinky": 10
      }
    }
  ],
  'mrl-delicategrab':   [
    {
      "hneck": 21,
      "eye": 98,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 30,
        "lift": 72,
        "rotate": 90,
        "elbow": 77,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 0,
        "lift": 91,
        "rotate": 90,
        "elbow": 28,
        "wrist": 17
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "leftHand": {
        "thumb": 180,
        "index": 130,
        "middle": 4,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 86,
        "index": 51,
        "middle": 133,
        "ring": 162,
        "pinky": 153
      }
    }
  ],
  'mrl-dontworry':   [
    {
      "hneck": 116,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 85,
        "lift": 93,
        "rotate": 90,
        "elbow": 42,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 87,
        "lift": 93,
        "rotate": 90,
        "elbow": 37,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 143
      },
      "leftHand": {
        "thumb": 124,
        "index": 82,
        "middle": 65,
        "ring": 81,
        "pinky": 41
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 21
      },
      "rightHand": {
        "thumb": 59,
        "index": 53,
        "middle": 89,
        "ring": 61,
        "pinky": 36
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-dropit':   [
    {
      "hneck": 20,
      "eye": 99,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 45,
        "rotate": 90,
        "elbow": 87,
        "wrist": 31
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 33,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 35
      },
      "leftHand": {
        "thumb": 60,
        "index": 61,
        "middle": 67,
        "ring": 34,
        "pinky": 34
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 72
      },
      "rightHand": {
        "thumb": 20,
        "index": 40,
        "middle": 40,
        "ring": 30,
        "pinky": 30
      }
    }
  ],
  'mrl-eatindianfood':   [
    {
      "hneck": 60,
      "eye": 40,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 166,
      "hold": 400
    },
    {
      "hneck": 80,
      "eye": 40,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 166,
      "hold": 1000
    },
    {
      "hneck": 100,
      "eye": 40,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 166,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 85,
        "lift": 106,
        "rotate": 90,
        "elbow": 25,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 87,
        "lift": 107,
        "rotate": 90,
        "elbow": 32,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 145
      },
      "leftHand": {
        "thumb": 110,
        "index": 62,
        "middle": 56,
        "ring": 88,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 27
      },
      "rightHand": {
        "thumb": 78,
        "index": 88,
        "middle": 101,
        "ring": 95,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 80,
      "eye": 40,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 166,
      "hold": 400
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 126,
      "hold": 1000
    }
  ],
  'mrl-explaining':   [
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    }
  ],
  'mrl-faceMove':   [
    {
      "hneck": 44,
      "eye": 82,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 15,
        "lift": 55,
        "rotate": 90,
        "elbow": 32,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 13,
        "lift": 40,
        "rotate": 90,
        "elbow": 32,
        "wrist": 13
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "leftHand": {
        "thumb": 61,
        "index": 0,
        "middle": 14,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 25
      },
      "rightHand": {
        "thumb": 0,
        "index": 24,
        "middle": 24,
        "ring": 19,
        "pinky": 21
      }
    },
    {
      "hneck": 44,
      "eye": 82,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 0,
        "lift": 85,
        "rotate": 90,
        "elbow": 28,
        "wrist": 22
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 0,
        "lift": 85,
        "rotate": 90,
        "elbow": 28,
        "wrist": 22
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 76
      },
      "leftHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 100
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 79,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 102,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 0,
        "lift": 84,
        "rotate": 90,
        "elbow": 25,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 0,
        "lift": 82,
        "rotate": 90,
        "elbow": 25,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 25
      },
      "leftHand": {
        "thumb": 92,
        "index": 33,
        "middle": 37,
        "ring": 50,
        "pinky": 60
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 160
      },
      "rightHand": {
        "thumb": 81,
        "index": 66,
        "middle": 82,
        "ring": 50,
        "pinky": 60
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500,
      "leftArm": {
        "shoulder": 2,
        "lift": 55,
        "rotate": 90,
        "elbow": 28,
        "wrist": 22
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 2,
        "lift": 55,
        "rotate": 90,
        "elbow": 28,
        "wrist": 22
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 76
      },
      "leftHand": {
        "thumb": 20,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 100
      },
      "rightHand": {
        "thumb": 20,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 134,
      "eye": 117,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 94,
      "hold": 1500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 41,
        "lift": 40,
        "rotate": 90,
        "elbow": 39,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 55,
        "lift": 40,
        "rotate": 90,
        "elbow": 34,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 76
      },
      "leftHand": {
        "thumb": 110,
        "index": 50,
        "middle": 50,
        "ring": 40,
        "pinky": 60
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 160
      },
      "rightHand": {
        "thumb": 110,
        "index": 66,
        "middle": 82,
        "ring": 60,
        "pinky": 60
      }
    }
  ],
  'mrl-fighter':   [
    {
      "hneck": 160,
      "eye": 87,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 31,
        "lift": 75,
        "rotate": 90,
        "elbow": 152,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 3,
        "lift": 94,
        "rotate": 90,
        "elbow": 33,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 83
      },
      "leftHand": {
        "thumb": 161,
        "index": 151,
        "middle": 133,
        "ring": 127,
        "pinky": 107
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 99,
        "index": 130,
        "middle": 152,
        "ring": 154,
        "pinky": 145
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-fingerleft':   [
    {
      "hneck": 80,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 7,
        "lift": 78,
        "rotate": 90,
        "elbow": 92,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 20,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 180,
        "index": 2,
        "middle": 175,
        "ring": 160,
        "pinky": 165
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 90,
      "tilt": 70,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-fingerright':   [
    {
      "hneck": 80,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 20,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 7,
        "lift": 78,
        "rotate": 90,
        "elbow": 92,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 180,
        "index": 2,
        "middle": 175,
        "ring": 160,
        "pinky": 165
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 30,
      "tilt": 30,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-finnishhello':   [
    {
      "hneck": 105,
      "eye": 78,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 78,
        "lift": 48,
        "rotate": 90,
        "elbow": 37,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 144,
        "rotate": 90,
        "elbow": 60,
        "wrist": 75
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 10
      },
      "leftHand": {
        "thumb": 112,
        "index": 111,
        "middle": 105,
        "ring": 102,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 50,
        "pinky": 82
      }
    },
    {
      "hneck": 83,
      "eye": 98,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 78,
        "lift": 48,
        "rotate": 90,
        "elbow": 37,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 157,
        "rotate": 90,
        "elbow": 47,
        "wrist": 75
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 10
      },
      "leftHand": {
        "thumb": 112,
        "index": 111,
        "middle": 105,
        "ring": 102,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 94
      },
      "rightHand": {
        "thumb": 3,
        "index": 0,
        "middle": 62,
        "ring": 41,
        "pinky": 117
      }
    },
    {
      "hneck": 83,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 78,
        "lift": 48,
        "rotate": 90,
        "elbow": 37,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 57,
        "lift": 145,
        "rotate": 90,
        "elbow": 50,
        "wrist": 68
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 15
      },
      "leftHand": {
        "thumb": 100,
        "index": 90,
        "middle": 85,
        "ring": 80,
        "pinky": 71
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 45
      },
      "rightHand": {
        "thumb": 3,
        "index": 0,
        "middle": 31,
        "ring": 12,
        "pinky": 26
      }
    },
    {
      "hneck": 83,
      "eye": 98,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 78,
        "lift": 48,
        "rotate": 90,
        "elbow": 37,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 157,
        "rotate": 90,
        "elbow": 47,
        "wrist": 75
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 10
      },
      "leftHand": {
        "thumb": 112,
        "index": 111,
        "middle": 105,
        "ring": 102,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 94
      },
      "rightHand": {
        "thumb": 3,
        "index": 0,
        "middle": 62,
        "ring": 41,
        "pinky": 117
      }
    },
    {
      "hneck": 79,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 35
      },
      "leftHand": {
        "thumb": 42,
        "index": 58,
        "middle": 42,
        "ring": 55,
        "pinky": 71
      }
    }
  ],
  'mrl-gestureforlondon3':   [
    {
      "hneck": 0,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 26,
        "lift": 105,
        "rotate": 90,
        "elbow": 30,
        "wrist": 25
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 37,
        "lift": 124,
        "rotate": 90,
        "elbow": 30,
        "wrist": 27
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 0,
      "eye": 40,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 156,
      "hold": 5000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 26,
        "lift": 105,
        "rotate": 90,
        "elbow": 30,
        "wrist": 25
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 37,
        "lift": 124,
        "rotate": 90,
        "elbow": 30,
        "wrist": 27
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 50,
      "eye": 120,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 88,
        "lift": 103,
        "rotate": 90,
        "elbow": 70,
        "wrist": 23
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 73,
        "lift": 97,
        "rotate": 90,
        "elbow": 70,
        "wrist": 27
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 50,
      "eye": 60,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 131,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 88,
        "lift": 104,
        "rotate": 90,
        "elbow": 75,
        "wrist": 28
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 80,
        "lift": 97,
        "rotate": 90,
        "elbow": 76,
        "wrist": 21
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 40,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 102,
        "rotate": 90,
        "elbow": 70,
        "wrist": 23
      }
    }
  ],
  'mrl-gestureforlondon4':   [
    {
      "hneck": 0,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 26,
        "lift": 105,
        "rotate": 90,
        "elbow": 30,
        "wrist": 25
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 37,
        "lift": 124,
        "rotate": 90,
        "elbow": 30,
        "wrist": 27
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 0,
      "eye": 40,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 5000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 26,
        "lift": 105,
        "rotate": 90,
        "elbow": 30,
        "wrist": 25
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 37,
        "lift": 124,
        "rotate": 90,
        "elbow": 30,
        "wrist": 27
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 0,
      "eye": 120,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 26,
        "lift": 105,
        "rotate": 90,
        "elbow": 30,
        "wrist": 25
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 37,
        "lift": 124,
        "rotate": 90,
        "elbow": 30,
        "wrist": 27
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 0,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 26,
        "lift": 105,
        "rotate": 90,
        "elbow": 30,
        "wrist": 25
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 37,
        "lift": 124,
        "rotate": 90,
        "elbow": 30,
        "wrist": 27
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 46,
      "eye": 10,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 9,
        "lift": 115,
        "rotate": 90,
        "elbow": 28,
        "wrist": 80
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 13,
        "lift": 118,
        "rotate": 90,
        "elbow": 26,
        "wrist": 80
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 64
      },
      "leftHand": {
        "thumb": 61,
        "index": 49,
        "middle": 14,
        "ring": 38,
        "pinky": 15
      }
    }
  ],
  'mrl-getball':   [
    {
      "hneck": 45,
      "eye": 65,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 16,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 6,
        "lift": 85,
        "rotate": 90,
        "elbow": 110,
        "wrist": 22
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 50,
        "index": 50,
        "middle": 40,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 3,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 71,
      "tilt": 60,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2500,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 180,
        "index": 140,
        "middle": 140,
        "ring": 3,
        "pinky": 0
      }
    }
  ],
  'mrl-givethebottle':   [
    {
      "hneck": 0,
      "eye": 92,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 20,
      "eye": 107,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 124,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 77,
        "lift": 85,
        "rotate": 90,
        "elbow": 45,
        "wrist": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 80,
        "lift": 62,
        "rotate": 90,
        "elbow": 38,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 80
      },
      "leftHand": {
        "thumb": 80,
        "index": 90,
        "middle": 90,
        "ring": 90,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 150
      },
      "rightHand": {
        "thumb": 145,
        "index": 112,
        "middle": 127,
        "ring": 105,
        "pinky": 143
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 42,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-givetheglass':   [
    {
      "hneck": 84,
      "eye": 79,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 77,
        "lift": 75,
        "rotate": 90,
        "elbow": 45,
        "wrist": 17
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 21,
        "lift": 80,
        "rotate": 90,
        "elbow": 77,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 60
      },
      "leftHand": {
        "thumb": 109,
        "index": 138,
        "middle": 180,
        "ring": 164,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 133
      },
      "rightHand": {
        "thumb": 102,
        "index": 86,
        "middle": 105,
        "ring": 105,
        "pinky": 143
      }
    }
  ],
  'mrl-grabthebottle':   [
    {
      "hneck": 20,
      "eye": 107,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 77,
        "lift": 85,
        "rotate": 90,
        "elbow": 45,
        "wrist": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 60
      },
      "leftHand": {
        "thumb": 180,
        "index": 138,
        "middle": 140,
        "ring": 164,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 44,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-grabtheglass':   [
    {
      "hneck": 20,
      "eye": 68,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 77,
        "lift": 85,
        "rotate": 90,
        "elbow": 45,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 48,
        "lift": 91,
        "rotate": 90,
        "elbow": 72,
        "wrist": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 50
      },
      "leftHand": {
        "thumb": 180,
        "index": 138,
        "middle": 140,
        "ring": 164,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 140
      },
      "rightHand": {
        "thumb": 140,
        "index": 112,
        "middle": 127,
        "ring": 105,
        "pinky": 143
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 75,
      "tilt": 65,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-handclose':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    }
  ],
  'mrl-handdown':   [
    {
      "hneck": 18,
      "eye": 75,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 66,
        "lift": 52,
        "rotate": 90,
        "elbow": 59,
        "wrist": 23
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 59,
        "lift": 60,
        "rotate": 90,
        "elbow": 50,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 140,
        "index": 148,
        "middle": 140,
        "ring": 10,
        "pinky": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 54,
        "index": 95,
        "middle": 66,
        "ring": 0,
        "pinky": 0
      }
    }
  ],
  'mrl-handopen':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    }
  ],
  'mrl-handsclose':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    }
  ],
  'mrl-handsopen':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    }
  ],
  'mrl-happy_1':   [
    {
      "hneck": 84,
      "eye": 88,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 36,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 74,
        "lift": 112,
        "rotate": 90,
        "elbow": 61,
        "wrist": 29
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 0,
        "index": 88,
        "middle": 135,
        "ring": 94,
        "pinky": 96
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 81,
        "index": 79,
        "middle": 118,
        "ring": 47,
        "pinky": 0
      }
    }
  ],
  'mrl-heard':   [
    {
      "hneck": 90,
      "eye": 60,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 120,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 90,
      "eye": 60,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 90,
      "eye": 120,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000,
      "leftArm": {
        "shoulder": 85,
        "lift": 93,
        "rotate": 90,
        "elbow": 42,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 87,
        "lift": 93,
        "rotate": 90,
        "elbow": 37,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 143
      },
      "leftHand": {
        "thumb": 124,
        "index": 82,
        "middle": 65,
        "ring": 81,
        "pinky": 41
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 21
      },
      "rightHand": {
        "thumb": 59,
        "index": 53,
        "middle": 89,
        "ring": 61,
        "pinky": 36
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 200
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000,
      "leftArm": {
        "shoulder": 85,
        "lift": 93,
        "rotate": 90,
        "elbow": 42,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 87,
        "lift": 93,
        "rotate": 90,
        "elbow": 37,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 143
      },
      "leftHand": {
        "thumb": 124,
        "index": 82,
        "middle": 65,
        "ring": 81,
        "pinky": 41
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 21
      },
      "rightHand": {
        "thumb": 59,
        "index": 53,
        "middle": 89,
        "ring": 61,
        "pinky": 36
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 200
    },
    {
      "hneck": 16,
      "eye": 11,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 200
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 60,
        "lift": 67,
        "rotate": 90,
        "elbow": 67,
        "wrist": 40
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 116,
        "rotate": 90,
        "elbow": 10,
        "wrist": 28
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 23
      },
      "leftHand": {
        "thumb": 143,
        "index": 69,
        "middle": 48,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 163
      },
      "rightHand": {
        "thumb": 89,
        "index": 60,
        "middle": 78,
        "ring": 43,
        "pinky": 68
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 131,
      "tilt": 22,
      "roll": 122,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    }
  ],
  'mrl-hello':   [
    {
      "hneck": 105,
      "eye": 78,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 78,
        "lift": 48,
        "rotate": 90,
        "elbow": 37,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 144,
        "rotate": 90,
        "elbow": 60,
        "wrist": 75
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 10
      },
      "leftHand": {
        "thumb": 112,
        "index": 111,
        "middle": 105,
        "ring": 102,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 50,
        "pinky": 82
      }
    },
    {
      "hneck": 83,
      "eye": 98,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 78,
        "lift": 48,
        "rotate": 90,
        "elbow": 37,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 157,
        "rotate": 90,
        "elbow": 47,
        "wrist": 75
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 10
      },
      "leftHand": {
        "thumb": 112,
        "index": 111,
        "middle": 105,
        "ring": 102,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 94
      },
      "rightHand": {
        "thumb": 3,
        "index": 0,
        "middle": 62,
        "ring": 41,
        "pinky": 117
      }
    },
    {
      "hneck": 83,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 78,
        "lift": 48,
        "rotate": 90,
        "elbow": 37,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 57,
        "lift": 145,
        "rotate": 90,
        "elbow": 50,
        "wrist": 68
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 15
      },
      "leftHand": {
        "thumb": 100,
        "index": 90,
        "middle": 85,
        "ring": 80,
        "pinky": 71
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 45
      },
      "rightHand": {
        "thumb": 3,
        "index": 0,
        "middle": 31,
        "ring": 12,
        "pinky": 26
      }
    },
    {
      "hneck": 83,
      "eye": 98,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 78,
        "lift": 48,
        "rotate": 90,
        "elbow": 37,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 157,
        "rotate": 90,
        "elbow": 47,
        "wrist": 75
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 10
      },
      "leftHand": {
        "thumb": 112,
        "index": 111,
        "middle": 105,
        "ring": 102,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 94
      },
      "rightHand": {
        "thumb": 3,
        "index": 0,
        "middle": 62,
        "ring": 41,
        "pinky": 117
      }
    },
    {
      "hneck": 79,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 35
      },
      "leftHand": {
        "thumb": 42,
        "index": 58,
        "middle": 42,
        "ring": 55,
        "pinky": 71
      }
    }
  ],
  'mrl-hi':   [
    {
      "hneck": 80,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 164,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 180,
        "index": 0,
        "middle": 0,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 0,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 180,
        "lift": 140,
        "rotate": 90,
        "elbow": 40,
        "wrist": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 30,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 80,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 70,
      "hold": 2000
    }
  ],
  'mrl-howdoyoudo':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 43,
        "lift": 88,
        "rotate": 90,
        "elbow": 22,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 20,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "leftHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000,
      "leftArm": {
        "shoulder": 30,
        "lift": 83,
        "rotate": 90,
        "elbow": 22,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 40,
        "lift": 85,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "leftHand": {
        "thumb": 130,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "rightHand": {
        "thumb": 130,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    }
  ],
  'mrl-howmanyfingersdoihave':   [
    {
      "hneck": 49,
      "eye": 74,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 75,
        "lift": 83,
        "rotate": 90,
        "elbow": 79,
        "wrist": 24
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 65,
        "lift": 82,
        "rotate": 90,
        "elbow": 71,
        "wrist": 24
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 92
      },
      "leftHand": {
        "thumb": 74,
        "index": 140,
        "middle": 150,
        "ring": 157,
        "pinky": 168
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "rightHand": {
        "thumb": 89,
        "index": 80,
        "middle": 98,
        "ring": 120,
        "pinky": 114
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "rightHand": {
        "thumb": 0,
        "index": 80,
        "middle": 98,
        "ring": 120,
        "pinky": 114
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 200,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 98,
        "ring": 120,
        "pinky": 114
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 200,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 120,
        "pinky": 114
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 200,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 114
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 200,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 40,
      "eye": 105,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 75,
        "lift": 83,
        "rotate": 90,
        "elbow": 79,
        "wrist": 24
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 65,
        "lift": 82,
        "rotate": 90,
        "elbow": 71,
        "wrist": 24
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "leftHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 40,
      "eye": 50,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 700
    },
    {
      "hneck": 49,
      "eye": 105,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 40,
      "eye": 50,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 700
    },
    {
      "hneck": 49,
      "eye": 105,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 700
    },
    {
      "hneck": 90,
      "eye": 85,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 700
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 700,
      "leftArm": {
        "shoulder": 70,
        "lift": 75,
        "rotate": 90,
        "elbow": 70,
        "wrist": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 60,
        "lift": 75,
        "rotate": 90,
        "elbow": 65,
        "wrist": 20
      }
    },
    {
      "hneck": 40,
      "eye": 105,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 75,
        "lift": 83,
        "rotate": 90,
        "elbow": 79,
        "wrist": 24
      }
    }
  ],
  'mrl-iloveyou':   [
    {
      "hneck": 116,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 85,
        "lift": 93,
        "rotate": 90,
        "elbow": 42,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 87,
        "lift": 93,
        "rotate": 90,
        "elbow": 37,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 143
      },
      "leftHand": {
        "thumb": 124,
        "index": 82,
        "middle": 65,
        "ring": 81,
        "pinky": 41
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 21
      },
      "rightHand": {
        "thumb": 59,
        "index": 53,
        "middle": 89,
        "ring": 61,
        "pinky": 36
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-isitaball':   [
    {
      "hneck": 70,
      "eye": 82,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 70,
        "lift": 59,
        "rotate": 90,
        "elbow": 95,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 12,
        "lift": 74,
        "rotate": 90,
        "elbow": 33,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 164
      },
      "leftHand": {
        "thumb": 170,
        "index": 150,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 105
      },
      "rightHand": {
        "thumb": 105,
        "index": 81,
        "middle": 78,
        "ring": 57,
        "pinky": 62
      }
    }
  ],
  'mrl-italianhello':   [
    {
      "hneck": 105,
      "eye": 78,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 78,
        "lift": 48,
        "rotate": 90,
        "elbow": 37,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 144,
        "rotate": 90,
        "elbow": 60,
        "wrist": 75
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 10
      },
      "leftHand": {
        "thumb": 112,
        "index": 111,
        "middle": 105,
        "ring": 102,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 50,
        "pinky": 82
      }
    },
    {
      "hneck": 83,
      "eye": 98,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 78,
        "lift": 48,
        "rotate": 90,
        "elbow": 37,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 157,
        "rotate": 90,
        "elbow": 47,
        "wrist": 75
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 10
      },
      "leftHand": {
        "thumb": 112,
        "index": 111,
        "middle": 105,
        "ring": 102,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 94
      },
      "rightHand": {
        "thumb": 3,
        "index": 0,
        "middle": 62,
        "ring": 41,
        "pinky": 117
      }
    },
    {
      "hneck": 83,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 78,
        "lift": 48,
        "rotate": 90,
        "elbow": 37,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 57,
        "lift": 145,
        "rotate": 90,
        "elbow": 50,
        "wrist": 68
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 15
      },
      "leftHand": {
        "thumb": 100,
        "index": 90,
        "middle": 85,
        "ring": 80,
        "pinky": 71
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 45
      },
      "rightHand": {
        "thumb": 3,
        "index": 0,
        "middle": 31,
        "ring": 12,
        "pinky": 26
      }
    },
    {
      "hneck": 83,
      "eye": 98,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 78,
        "lift": 48,
        "rotate": 90,
        "elbow": 37,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 157,
        "rotate": 90,
        "elbow": 47,
        "wrist": 75
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 10
      },
      "leftHand": {
        "thumb": 112,
        "index": 111,
        "middle": 105,
        "ring": 102,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 94
      },
      "rightHand": {
        "thumb": 3,
        "index": 0,
        "middle": 62,
        "ring": 41,
        "pinky": 117
      }
    },
    {
      "hneck": 79,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 35
      },
      "leftHand": {
        "thumb": 42,
        "index": 58,
        "middle": 42,
        "ring": 55,
        "pinky": 71
      }
    }
  ],
  'mrl-juggle':   [
    {
      "hneck": 20,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 109,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 30,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 40,
        "lift": 73,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 53,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 300,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 100,
        "index": 50,
        "middle": 40,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 180,
        "index": 160,
        "middle": 160,
        "ring": 160,
        "pinky": 160
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1200,
      "leftArm": {
        "shoulder": 30,
        "lift": 73,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 60,
        "lift": 75,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 50,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 20,
      "eye": 110,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 123,
      "hold": 200
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 60,
        "lift": 73,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 20,
        "lift": 60,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 50,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 47,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 300,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 50,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 150
      },
      "leftHand": {
        "thumb": 180,
        "index": 160,
        "middle": 160,
        "ring": 160,
        "pinky": 160
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 300,
      "leftArm": {
        "shoulder": 40,
        "lift": 75,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 800,
      "rightArm": {
        "shoulder": 30,
        "lift": 73,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 60,
        "lift": 75,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 20,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 109,
      "hold": 200
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 60,
        "lift": 73,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 20,
        "lift": 60,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 50,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 53,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-juggle2':   [
    {
      "hneck": 20,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 109,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 15,
        "lift": 73,
        "rotate": 90,
        "elbow": 60,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 40,
        "lift": 73,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 53,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 300,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 100,
        "index": 50,
        "middle": 40,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 150,
        "index": 90,
        "middle": 120,
        "ring": 160,
        "pinky": 160
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1200,
      "leftArm": {
        "shoulder": 30,
        "lift": 73,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 60,
        "lift": 75,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 50,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 20,
      "eye": 110,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 123,
      "hold": 200
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 45,
        "lift": 73,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 60,
        "lift": 55,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 50,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 47,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 300,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 50,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 150
      },
      "leftHand": {
        "thumb": 150,
        "index": 120,
        "middle": 90,
        "ring": 120,
        "pinky": 120
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 200,
      "rightArm": {
        "shoulder": 70,
        "lift": 100,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 150,
        "index": 90,
        "middle": 120,
        "ring": 160,
        "pinky": 160
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 600,
      "rightArm": {
        "shoulder": 20,
        "lift": 100,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 150,
        "index": 90,
        "middle": 120,
        "ring": 160,
        "pinky": 160
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 600,
      "rightArm": {
        "shoulder": 20,
        "lift": 60,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 150,
        "index": 90,
        "middle": 120,
        "ring": 160,
        "pinky": 160
      }
    }
  ],
  'mrl-juggleCloseHand':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1200,
      "leftArm": {
        "shoulder": 60,
        "lift": 75,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 60,
        "lift": 75,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 50,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 150
      },
      "leftHand": {
        "thumb": 50,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 20,
      "eye": 110,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 123,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 60,
        "lift": 55,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 60,
        "lift": 55,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 47,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 300,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 180,
        "index": 130,
        "middle": 120,
        "ring": 140,
        "pinky": 160
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 150
      },
      "leftHand": {
        "thumb": 180,
        "index": 130,
        "middle": 120,
        "ring": 140,
        "pinky": 160
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 5000,
      "rightArm": {
        "shoulder": 70,
        "lift": 100,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 180,
        "index": 130,
        "middle": 120,
        "ring": 140,
        "pinky": 160
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 600,
      "rightArm": {
        "shoulder": 20,
        "lift": 100,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 180,
        "index": 130,
        "middle": 120,
        "ring": 140,
        "pinky": 160
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 600,
      "rightArm": {
        "shoulder": 20,
        "lift": 60,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 180,
        "index": 130,
        "middle": 120,
        "ring": 140,
        "pinky": 160
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 50,
        "lift": 80,
        "rotate": 90,
        "elbow": 55,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 150
      },
      "leftHand": {
        "thumb": 180,
        "index": 130,
        "middle": 120,
        "ring": 140,
        "pinky": 160
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 600,
      "rightArm": {
        "shoulder": 70,
        "lift": 60,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 180,
        "index": 130,
        "middle": 120,
        "ring": 140,
        "pinky": 160
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-keepball':   [
    {
      "hneck": 20,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 16,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 54,
        "lift": 77,
        "rotate": 90,
        "elbow": 55,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 50,
        "index": 50,
        "middle": 40,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 180,
        "index": 140,
        "middle": 140,
        "ring": 3,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-lookAtThis':   [
    {
      "hneck": 66,
      "eye": 79,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 89,
        "lift": 75,
        "rotate": 90,
        "elbow": 78,
        "wrist": 19
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 91,
        "rotate": 90,
        "elbow": 72,
        "wrist": 26
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 29
      },
      "leftHand": {
        "thumb": 92,
        "index": 106,
        "middle": 133,
        "ring": 127,
        "pinky": 107
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 86,
        "index": 51,
        "middle": 133,
        "ring": 162,
        "pinky": 153
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-madeby':   [
    {
      "hneck": 80,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 45,
        "index": 40,
        "middle": 30,
        "ring": 25,
        "pinky": 35
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 55,
        "index": 2,
        "middle": 50,
        "ring": 48,
        "pinky": 30
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 80,
      "eye": 98,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 45,
        "index": 40,
        "middle": 30,
        "ring": 25,
        "pinky": 35
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 55,
        "index": 2,
        "middle": 50,
        "ring": 48,
        "pinky": 30
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 89,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 42,
        "lift": 104,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 33,
        "lift": 116,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 120
      },
      "leftHand": {
        "thumb": 45,
        "index": 40,
        "middle": 30,
        "ring": 25,
        "pinky": 35
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 40
      },
      "rightHand": {
        "thumb": 55,
        "index": 2,
        "middle": 50,
        "ring": 48,
        "pinky": 30
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 80,
      "eye": 98,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 99,
        "rotate": 90,
        "elbow": 30,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 30,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 73
      },
      "leftHand": {
        "thumb": 120,
        "index": 116,
        "middle": 110,
        "ring": 115,
        "pinky": 98
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 109
      },
      "rightHand": {
        "thumb": 114,
        "index": 146,
        "middle": 125,
        "ring": 113,
        "pinky": 117
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-madebyfrench':   [
    {
      "hneck": 80,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 45,
        "index": 40,
        "middle": 30,
        "ring": 25,
        "pinky": 35
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 55,
        "index": 2,
        "middle": 50,
        "ring": 48,
        "pinky": 30
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 80,
      "eye": 98,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 45,
        "index": 40,
        "middle": 30,
        "ring": 25,
        "pinky": 35
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 55,
        "index": 2,
        "middle": 50,
        "ring": 48,
        "pinky": 30
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 89,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 42,
        "lift": 104,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 33,
        "lift": 116,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 120
      },
      "leftHand": {
        "thumb": 45,
        "index": 40,
        "middle": 30,
        "ring": 25,
        "pinky": 35
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 40
      },
      "rightHand": {
        "thumb": 55,
        "index": 2,
        "middle": 50,
        "ring": 48,
        "pinky": 30
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 80,
      "eye": 98,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 99,
        "rotate": 90,
        "elbow": 30,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 30,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 73
      },
      "leftHand": {
        "thumb": 120,
        "index": 116,
        "middle": 110,
        "ring": 115,
        "pinky": 98
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 109
      },
      "rightHand": {
        "thumb": 114,
        "index": 146,
        "middle": 125,
        "ring": 113,
        "pinky": 117
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-missedYou':   [
    {
      "hneck": 80,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 26,
        "lift": 105,
        "rotate": 90,
        "elbow": 30,
        "wrist": 25
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 37,
        "lift": 124,
        "rotate": 90,
        "elbow": 30,
        "wrist": 27
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 20,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 153,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 60,
        "lift": 60,
        "rotate": 90,
        "elbow": 45,
        "wrist": 30
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 60,
        "lift": 60,
        "rotate": 90,
        "elbow": 45,
        "wrist": 30
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 20,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 20,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 20,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 153,
      "hold": 4000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 71,
        "lift": 94,
        "rotate": 90,
        "elbow": 41,
        "wrist": 31
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 71,
        "lift": 94,
        "rotate": 90,
        "elbow": 41,
        "wrist": 31
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 20,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 20,
        "index": 20,
        "middle": 20,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 28,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 28,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 25
      },
      "leftHand": {
        "thumb": 92,
        "index": 33,
        "middle": 37,
        "ring": 71,
        "pinky": 66
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 113
      },
      "rightHand": {
        "thumb": 81,
        "index": 66,
        "middle": 82,
        "ring": 60,
        "pinky": 105
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-more':   [
    {
      "hneck": 13,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 64,
        "lift": 52,
        "rotate": 90,
        "elbow": 59,
        "wrist": 23
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 75,
        "lift": 60,
        "rotate": 90,
        "elbow": 50,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 140,
        "index": 148,
        "middle": 140,
        "ring": 10,
        "pinky": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 80,
        "index": 114,
        "middle": 114,
        "ring": 3,
        "pinky": 0
      }
    }
  ],
  'mrl-negative':   [
    {
      "hneck": 18,
      "eye": 75,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 120,
      "eye": 75,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 18,
      "eye": 75,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 66,
        "lift": 52,
        "rotate": 90,
        "elbow": 59,
        "wrist": 23
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 59,
        "lift": 60,
        "rotate": 90,
        "elbow": 50,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 140,
        "index": 148,
        "middle": 140,
        "ring": 10,
        "pinky": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "rightHand": {
        "thumb": 140,
        "index": 148,
        "middle": 140,
        "ring": 10,
        "pinky": 10
      }
    }
  ],
  'mrl-newyork':   [
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 70,
        "lift": 90,
        "rotate": 90,
        "elbow": 75,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 40,
        "index": 171,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 60,
      "eye": 107,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 450
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 49,
        "lift": 90,
        "rotate": 90,
        "elbow": 75,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 40,
        "index": 171,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 60,
      "eye": 107,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 450
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 70,
        "lift": 90,
        "rotate": 90,
        "elbow": 75,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 40,
        "index": 171,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 60,
      "eye": 107,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 450
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 49,
        "lift": 90,
        "rotate": 90,
        "elbow": 75,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 40,
        "index": 171,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 60,
      "eye": 107,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 450
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 70,
        "lift": 90,
        "rotate": 90,
        "elbow": 75,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 40,
        "index": 171,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    }
  ],
  'mrl-notTrue':   [
    {
      "hneck": 16,
      "eye": 11,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 200
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 60,
        "lift": 67,
        "rotate": 90,
        "elbow": 67,
        "wrist": 40
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 116,
        "rotate": 90,
        "elbow": 10,
        "wrist": 28
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 23
      },
      "leftHand": {
        "thumb": 143,
        "index": 69,
        "middle": 48,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 163
      },
      "rightHand": {
        "thumb": 89,
        "index": 60,
        "middle": 78,
        "ring": 43,
        "pinky": 68
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 131,
      "tilt": 22,
      "roll": 122,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-oneFinger':   [
    {
      "hneck": 64,
      "eye": 94,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 127,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 60,
        "rotate": 90,
        "elbow": 83,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2500,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 0,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 64,
      "eye": 94,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 117,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 60,
        "rotate": 90,
        "elbow": 83,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2500,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 0,
        "index": 0,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 64,
      "eye": 94,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 117,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 80,
        "lift": 66,
        "rotate": 90,
        "elbow": 83,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2500,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 43,
      "eye": 94,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 80,
        "lift": 58,
        "rotate": 90,
        "elbow": 75,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2500,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-openlefthand':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    }
  ],
  'mrl-openrighthand':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    }
  ],
  'mrl-passiveanswer':   [
    {
      "hneck": 116,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 60,
        "lift": 93,
        "rotate": 90,
        "elbow": 42,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 60,
        "lift": 93,
        "rotate": 90,
        "elbow": 37,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 143
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 65,
        "ring": 81,
        "pinky": 41
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 21
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 18,
        "ring": 61,
        "pinky": 36
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-perfect':   [
    {
      "hneck": 88,
      "eye": 79,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 89,
        "lift": 75,
        "rotate": 90,
        "elbow": 93,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 0,
        "lift": 91,
        "rotate": 90,
        "elbow": 28,
        "wrist": 17
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 34
      },
      "leftHand": {
        "thumb": 130,
        "index": 160,
        "middle": 83,
        "ring": 40,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 86,
        "index": 51,
        "middle": 133,
        "ring": 162,
        "pinky": 153
      }
    }
  ],
  'mrl-phonehome':   [
    {
      "hneck": 160,
      "eye": 68,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 86,
        "rotate": 90,
        "elbow": 30,
        "wrist": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 86,
        "lift": 140,
        "rotate": 90,
        "elbow": 83,
        "wrist": 80
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 26
      },
      "leftHand": {
        "thumb": 99,
        "index": 140,
        "middle": 173,
        "ring": 167,
        "pinky": 130
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 135,
        "index": 6,
        "middle": 170,
        "ring": 145,
        "pinky": 168
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 0,
      "tilt": 40,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-photo':   [
    {
      "hneck": 87,
      "eye": 60,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 78,
        "lift": 48,
        "rotate": 90,
        "elbow": 37,
        "wrist": 11
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 46,
        "lift": 147,
        "rotate": 90,
        "elbow": 5,
        "wrist": 75
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 138,
        "index": 52,
        "middle": 159,
        "ring": 106,
        "pinky": 120
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 140
      },
      "rightHand": {
        "thumb": 80,
        "index": 65,
        "middle": 94,
        "ring": 63,
        "pinky": 70
      }
    }
  ],
  'mrl-picturebothside':   [
    {
      "hneck": 109,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 105,
        "rotate": 90,
        "elbow": 24,
        "wrist": 75
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 115,
        "rotate": 90,
        "elbow": 23,
        "wrist": 68
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "leftHand": {
        "thumb": 50,
        "index": 86,
        "middle": 97,
        "ring": 74,
        "pinky": 106
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 45
      },
      "rightHand": {
        "thumb": 10,
        "index": 112,
        "middle": 95,
        "ring": 91,
        "pinky": 125
      }
    }
  ],
  'mrl-pictureleftside':   [
    {
      "hneck": 109,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 105,
        "rotate": 90,
        "elbow": 24,
        "wrist": 75
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "leftHand": {
        "thumb": 50,
        "index": 86,
        "middle": 97,
        "ring": 74,
        "pinky": 106
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 113
      },
      "rightHand": {
        "thumb": 81,
        "index": 65,
        "middle": 82,
        "ring": 60,
        "pinky": 105
      }
    }
  ],
  'mrl-picturerightside':   [
    {
      "hneck": 109,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 115,
        "rotate": 90,
        "elbow": 23,
        "wrist": 68
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 35
      },
      "leftHand": {
        "thumb": 42,
        "index": 58,
        "middle": 87,
        "ring": 55,
        "pinky": 71
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 45
      },
      "rightHand": {
        "thumb": 10,
        "index": 112,
        "middle": 95,
        "ring": 91,
        "pinky": 125
      }
    }
  ],
  'mrl-playsong':   [
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 110,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 110,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 110,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 110,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 110,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 110,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 110,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 110,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 110,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 110,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 6000
    },
    {
      "hneck": 110,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    }
  ],
  'mrl-poorbottle':   [
    {
      "hneck": 0,
      "eye": 92,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 55,
        "lift": 40,
        "rotate": 90,
        "elbow": 94,
        "wrist": 55
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 80,
        "lift": 62,
        "rotate": 90,
        "elbow": 38,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 180,
        "index": 140,
        "middle": 150,
        "ring": 164,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 150
      },
      "rightHand": {
        "thumb": 145,
        "index": 112,
        "middle": 127,
        "ring": 105,
        "pinky": 143
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-putitdown':   [
    {
      "hneck": 20,
      "eye": 99,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 45,
        "rotate": 90,
        "elbow": 87,
        "wrist": 31
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 33,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 35
      },
      "leftHand": {
        "thumb": 147,
        "index": 130,
        "middle": 135,
        "ring": 34,
        "pinky": 34
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 72
      },
      "rightHand": {
        "thumb": 20,
        "index": 40,
        "middle": 40,
        "ring": 30,
        "pinky": 30
      }
    }
  ],
  'mrl-ready':   [
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 65,
        "lift": 90,
        "rotate": 90,
        "elbow": 75,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 20,
        "lift": 80,
        "rotate": 90,
        "elbow": 25,
        "wrist": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 130,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 50,
        "index": 90,
        "middle": 90,
        "ring": 90,
        "pinky": 100
      }
    }
  ],
  'mrl-releasedelicate':   [
    {
      "hneck": 20,
      "eye": 98,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 30,
        "lift": 72,
        "rotate": 90,
        "elbow": 64,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 0,
        "lift": 91,
        "rotate": 90,
        "elbow": 28,
        "wrist": 17
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "leftHand": {
        "thumb": 101,
        "index": 74,
        "middle": 66,
        "ring": 58,
        "pinky": 44
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 86,
        "index": 51,
        "middle": 133,
        "ring": 162,
        "pinky": 153
      }
    }
  ],
  'mrl-releaseleftclothes':   [
    {
      "hneck": 0,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 124,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 97,
        "lift": 51,
        "rotate": 90,
        "elbow": 25,
        "wrist": 27
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 81,
        "lift": 52,
        "rotate": 90,
        "elbow": 22,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 25
      },
      "leftHand": {
        "thumb": 92,
        "index": 33,
        "middle": 37,
        "ring": 71,
        "pinky": 66
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 124,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 97,
        "lift": 51,
        "rotate": 90,
        "elbow": 25,
        "wrist": 22
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 135,
        "rotate": 90,
        "elbow": 22,
        "wrist": 36
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 25
      },
      "leftHand": {
        "thumb": 92,
        "index": 33,
        "middle": 37,
        "ring": 71,
        "pinky": 66
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 139
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 34,
      "tilt": 40,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 38,
      "eye": 43,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 142,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 97,
        "lift": 51,
        "rotate": 90,
        "elbow": 25,
        "wrist": 22
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 135,
        "rotate": 90,
        "elbow": 22,
        "wrist": 36
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 25
      },
      "leftHand": {
        "thumb": 92,
        "index": 33,
        "middle": 37,
        "ring": 71,
        "pinky": 66
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 139
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 36,
      "tilt": 40,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 80,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 124,
      "hold": 4000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 28,
        "wrist": 14
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 28,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 25
      },
      "leftHand": {
        "thumb": 92,
        "index": 33,
        "middle": 37,
        "ring": 71,
        "pinky": 66
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 113
      },
      "rightHand": {
        "thumb": 81,
        "index": 66,
        "middle": 82,
        "ring": 60,
        "pinky": 105
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-removeleftarm':   [
    {
      "hneck": 20,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 71,
        "lift": 94,
        "rotate": 90,
        "elbow": 41,
        "wrist": 31
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 35
      },
      "leftHand": {
        "thumb": 60,
        "index": 43,
        "middle": 45,
        "ring": 34,
        "pinky": 34
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 72
      },
      "rightHand": {
        "thumb": 20,
        "index": 40,
        "middle": 40,
        "ring": 30,
        "pinky": 30
      }
    }
  ],
  'mrl-rightbicepsraise':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 180,
        "lift": 80,
        "rotate": 90,
        "elbow": 0,
        "wrist": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 0,
        "lift": 80,
        "rotate": 90,
        "elbow": 0,
        "wrist": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 180,
        "lift": 80,
        "rotate": 90,
        "elbow": 0,
        "wrist": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 0,
        "lift": 80,
        "rotate": 90,
        "elbow": 0,
        "wrist": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 0,
        "lift": 0,
        "rotate": 90,
        "elbow": 0,
        "wrist": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 0,
        "lift": 0,
        "rotate": 90,
        "elbow": 0,
        "wrist": 180
      }
    }
  ],
  'mrl-rightclothes':   [
    {
      "hneck": 20,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 123,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 47,
        "lift": 86,
        "rotate": 90,
        "elbow": 41,
        "wrist": 14
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 72
      },
      "rightHand": {
        "thumb": 20,
        "index": 20,
        "middle": 40,
        "ring": 30,
        "pinky": 30
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 20,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 123,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 47,
        "lift": 86,
        "rotate": 90,
        "elbow": 41,
        "wrist": 14
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 60,
        "lift": 82,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 156
      },
      "rightHand": {
        "thumb": 20,
        "index": 20,
        "middle": 40,
        "ring": 30,
        "pinky": 39
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 20,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 123,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 47,
        "lift": 86,
        "rotate": 90,
        "elbow": 41,
        "wrist": 14
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 67,
        "lift": 40,
        "rotate": 90,
        "elbow": 47,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 156
      },
      "rightHand": {
        "thumb": 20,
        "index": 20,
        "middle": 40,
        "ring": 30,
        "pinky": 39
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 20,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 123,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 14,
        "lift": 86,
        "rotate": 90,
        "elbow": 55,
        "wrist": 14
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 67,
        "lift": 40,
        "rotate": 90,
        "elbow": 47,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 156
      },
      "rightHand": {
        "thumb": 20,
        "index": 20,
        "middle": 40,
        "ring": 30,
        "pinky": 39
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-rollHead':   [
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 159,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 76,
      "hold": 500
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 159,
      "hold": 1000
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 76,
      "hold": 1000
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    }
  ],
  'mrl-servos':   [
    {
      "hneck": 79,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 119,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 111,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 35
      },
      "leftHand": {
        "thumb": 42,
        "index": 58,
        "middle": 87,
        "ring": 55,
        "pinky": 71
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 113
      },
      "rightHand": {
        "thumb": 81,
        "index": 20,
        "middle": 82,
        "ring": 60,
        "pinky": 105
      }
    },
    {
      "hneck": 124,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 89,
        "lift": 94,
        "rotate": 90,
        "elbow": 91,
        "wrist": 35
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 20,
        "lift": 67,
        "rotate": 90,
        "elbow": 31,
        "wrist": 22
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 106,
        "index": 41,
        "middle": 161,
        "ring": 147,
        "pinky": 138
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 54,
        "pinky": 91
      }
    },
    {
      "hneck": 105,
      "eye": 76,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 89,
        "lift": 106,
        "rotate": 90,
        "elbow": 103,
        "wrist": 35
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 35,
        "lift": 67,
        "rotate": 90,
        "elbow": 31,
        "wrist": 22
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 7
      },
      "leftHand": {
        "thumb": 106,
        "index": 0,
        "middle": 0,
        "ring": 147,
        "pinky": 138
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 54,
        "pinky": 91
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 200,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 7
      },
      "leftHand": {
        "thumb": 106,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 90,
      "eye": 40,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 89,
        "lift": 106,
        "rotate": 90,
        "elbow": 103,
        "wrist": 35
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 35,
        "lift": 67,
        "rotate": 90,
        "elbow": 31,
        "wrist": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 7
      },
      "leftHand": {
        "thumb": 106,
        "index": 140,
        "middle": 140,
        "ring": 140,
        "pinky": 140
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 54,
        "pinky": 91
      }
    },
    {
      "hneck": 105,
      "eye": 125,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 60,
        "lift": 100,
        "rotate": 90,
        "elbow": 85,
        "wrist": 30
      }
    },
    {
      "hneck": 40,
      "eye": 56,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-showObject':   [
    {
      "hneck": 0,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 117,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 0,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 71,
        "lift": 69,
        "rotate": 90,
        "elbow": 58,
        "wrist": 24
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 14
      },
      "leftHand": {
        "thumb": 80,
        "index": 80,
        "middle": 80,
        "ring": 80,
        "pinky": 80
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 180,
        "index": 0,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 48,
        "lift": 94,
        "rotate": 90,
        "elbow": 63,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 82,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 180,
        "index": 32,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 80,
        "index": 80,
        "middle": 80,
        "ring": 80,
        "pinky": 80
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 41,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 0,
        "lift": 84,
        "rotate": 90,
        "elbow": 28,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 65,
        "lift": 82,
        "rotate": 90,
        "elbow": 58,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 28
      },
      "leftHand": {
        "thumb": 80,
        "index": 80,
        "middle": 80,
        "ring": 80,
        "pinky": 80
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 180,
        "index": 0,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 52,
      "tilt": 45,
      "roll": 121,
      "hold": 400
    }
  ],
  'mrl-signature':   [
    {
      "hneck": 0,
      "eye": 102,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 84,
        "lift": 73,
        "rotate": 90,
        "elbow": 49,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 82,
        "lift": 67,
        "rotate": 90,
        "elbow": 45,
        "wrist": 24
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 120
      },
      "leftHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 165
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 179,
        "pinky": 180
      }
    },
    {
      "hneck": 0,
      "eye": 83,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 70,
        "lift": 65,
        "rotate": 90,
        "elbow": 55,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 101,
        "lift": 67,
        "rotate": 90,
        "elbow": 63,
        "wrist": 24
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 120
      },
      "leftHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 165
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 179,
        "pinky": 180
      }
    },
    {
      "hneck": 0,
      "eye": 83,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 70,
        "lift": 50,
        "rotate": 90,
        "elbow": 55,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 79,
        "lift": 45,
        "rotate": 90,
        "elbow": 72,
        "wrist": 24
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 120
      },
      "leftHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 165
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 179,
        "pinky": 180
      }
    },
    {
      "hneck": 0,
      "eye": 83,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 77,
        "lift": 50,
        "rotate": 90,
        "elbow": 55,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 79,
        "lift": 45,
        "rotate": 90,
        "elbow": 72,
        "wrist": 24
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 120
      },
      "leftHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 165
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 179,
        "pinky": 180
      }
    },
    {
      "hneck": 0,
      "eye": 83,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 77,
        "lift": 50,
        "rotate": 90,
        "elbow": 60,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 85,
        "lift": 43,
        "rotate": 90,
        "elbow": 72,
        "wrist": 24
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 120
      },
      "leftHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    }
  ],
  'mrl-sing':   [
    {
      "hneck": 80,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 139,
        "rotate": 90,
        "elbow": 15,
        "wrist": 79
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 145,
        "rotate": 90,
        "elbow": 37,
        "wrist": 79
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 76
      },
      "leftHand": {
        "thumb": 50,
        "index": 28,
        "middle": 30,
        "ring": 10,
        "pinky": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 139
      },
      "rightHand": {
        "thumb": 10,
        "index": 10,
        "middle": 10,
        "ring": 10,
        "pinky": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 118,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 118,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 139,
        "rotate": 90,
        "elbow": 15,
        "wrist": 70
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 145,
        "rotate": 90,
        "elbow": 37,
        "wrist": 70
      }
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 125,
        "rotate": 90,
        "elbow": 15,
        "wrist": 79
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 135,
        "rotate": 90,
        "elbow": 37,
        "wrist": 79
      }
    },
    {
      "hneck": 118,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 139,
        "rotate": 90,
        "elbow": 15,
        "wrist": 79
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 145,
        "rotate": 90,
        "elbow": 37,
        "wrist": 79
      }
    },
    {
      "hneck": 118,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 700
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 139,
        "rotate": 90,
        "elbow": 15,
        "wrist": 70
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 145,
        "rotate": 90,
        "elbow": 37,
        "wrist": 70
      }
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 125,
        "rotate": 90,
        "elbow": 15,
        "wrist": 79
      }
    }
  ],
  'mrl-slowlycloselefthand':   [
    {
      "hneck": 30,
      "eye": 60,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 80,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "leftHand": {
        "thumb": 176,
        "index": 173,
        "middle": 175,
        "ring": 175,
        "pinky": 2
      }
    }
  ],
  'mrl-slowlycloserighthand':   [
    {
      "hneck": 30,
      "eye": 60,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 80,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 176,
        "index": 173,
        "middle": 175,
        "ring": 175,
        "pinky": 2
      }
    }
  ],
  'mrl-speakhindi':   [
    {
      "hneck": 116,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 85,
        "lift": 93,
        "rotate": 90,
        "elbow": 42,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 87,
        "lift": 93,
        "rotate": 90,
        "elbow": 37,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 143
      },
      "leftHand": {
        "thumb": 124,
        "index": 82,
        "middle": 65,
        "ring": 81,
        "pinky": 41
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 21
      },
      "rightHand": {
        "thumb": 59,
        "index": 53,
        "middle": 89,
        "ring": 61,
        "pinky": 36
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-stopTravel':   [
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 90,
        "rotate": 90,
        "elbow": 19,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 90,
        "rotate": 90,
        "elbow": 19,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    }
  ],
  'mrl-story':   [
    {
      "hneck": 79,
      "eye": 100,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 119,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 111,
        "rotate": 90,
        "elbow": 28,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 35
      },
      "leftHand": {
        "thumb": 42,
        "index": 58,
        "middle": 87,
        "ring": 55,
        "pinky": 71
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 113
      },
      "rightHand": {
        "thumb": 81,
        "index": 20,
        "middle": 82,
        "ring": 60,
        "pinky": 105
      }
    },
    {
      "hneck": 124,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 89,
        "lift": 94,
        "rotate": 90,
        "elbow": 91,
        "wrist": 35
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 20,
        "lift": 67,
        "rotate": 90,
        "elbow": 31,
        "wrist": 22
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 106,
        "index": 41,
        "middle": 161,
        "ring": 147,
        "pinky": 138
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 54,
        "pinky": 91
      }
    },
    {
      "hneck": 105,
      "eye": 76,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 89,
        "lift": 106,
        "rotate": 90,
        "elbow": 103,
        "wrist": 35
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 35,
        "lift": 67,
        "rotate": 90,
        "elbow": 31,
        "wrist": 22
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 7
      },
      "leftHand": {
        "thumb": 106,
        "index": 0,
        "middle": 0,
        "ring": 147,
        "pinky": 138
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 54,
        "pinky": 91
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 200,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 7
      },
      "leftHand": {
        "thumb": 106,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 90,
      "eye": 40,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 89,
        "lift": 106,
        "rotate": 90,
        "elbow": 103,
        "wrist": 35
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 35,
        "lift": 67,
        "rotate": 90,
        "elbow": 31,
        "wrist": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 7
      },
      "leftHand": {
        "thumb": 106,
        "index": 140,
        "middle": 140,
        "ring": 140,
        "pinky": 140
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 54,
        "pinky": 91
      }
    },
    {
      "hneck": 105,
      "eye": 125,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 500
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 60,
        "lift": 100,
        "rotate": 90,
        "elbow": 85,
        "wrist": 30
      }
    },
    {
      "hneck": 40,
      "eye": 56,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-studyball':   [
    {
      "hneck": 20,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 16,
        "wrist": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 54,
        "lift": 77,
        "rotate": 90,
        "elbow": 45,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 0,
        "index": 50,
        "middle": 40,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1500,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 110,
        "index": 160,
        "middle": 150,
        "ring": 40,
        "pinky": 40
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 3000,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 110,
        "index": 110,
        "middle": 120,
        "ring": 40,
        "pinky": 40
      }
    },
    {
      "hneck": 20,
      "eye": 84,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 65,
        "lift": 52,
        "rotate": 90,
        "elbow": 62,
        "wrist": 23
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 60,
        "lift": 50,
        "rotate": 90,
        "elbow": 35,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 10,
        "pinky": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 180,
        "index": 145,
        "middle": 145,
        "ring": 3,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 45,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 10,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 4000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 80,
        "lift": 45,
        "rotate": 90,
        "elbow": 59,
        "wrist": 23
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 75,
        "lift": 40,
        "rotate": 90,
        "elbow": 50,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1500,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 180,
        "index": 0,
        "middle": 40,
        "ring": 10,
        "pinky": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 180,
        "index": 0,
        "middle": 40,
        "ring": 10,
        "pinky": 10
      }
    },
    {
      "hneck": 13,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 4000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 80,
        "lift": 45,
        "rotate": 90,
        "elbow": 59,
        "wrist": 23
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 75,
        "lift": 40,
        "rotate": 90,
        "elbow": 50,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1500,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 10,
        "ring": 10,
        "pinky": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 180,
        "index": 148,
        "middle": 140,
        "ring": 10,
        "pinky": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 60,
        "index": 120,
        "middle": 120,
        "ring": 40,
        "pinky": 40
      }
    }
  ],
  'mrl-systemcheck':   [
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 40,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 165,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 90,
      "eye": 160,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 20,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 159,
      "hold": 1000
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 81,
      "hold": 1000
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 159,
      "hold": 1000
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 81,
      "hold": 1000
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 25,
      "eye": 61,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 0,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 24,
        "lift": 62,
        "rotate": 90,
        "elbow": 52,
        "wrist": 45
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 20,
      "eye": 122,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 24,
        "lift": 62,
        "rotate": 90,
        "elbow": 52,
        "wrist": 45
      }
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 20,
      "eye": 120,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 75,
        "lift": 123,
        "rotate": 90,
        "elbow": 52,
        "wrist": 45
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 75,
        "lift": 123,
        "rotate": 90,
        "elbow": 52,
        "wrist": 45
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 30
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 170
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    }
  ],
  'mrl-takeball':   [
    {
      "hneck": 30,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 16,
        "wrist": 15
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 6,
        "lift": 73,
        "rotate": 90,
        "elbow": 66,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 50,
        "index": 50,
        "middle": 40,
        "ring": 20,
        "pinky": 20
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 180,
        "index": 140,
        "middle": 140,
        "ring": 3,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 65,
      "tilt": 55,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-takethis':   [
    {
      "hneck": 14,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 13,
        "lift": 45,
        "rotate": 90,
        "elbow": 95,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 5,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 60
      },
      "leftHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 113
      },
      "rightHand": {
        "thumb": 81,
        "index": 66,
        "middle": 82,
        "ring": 60,
        "pinky": 105
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 55,
      "tilt": 36,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 80,
      "tilt": 50,
      "roll": 120,
      "hold": 3000
    }
  ],
  'mrl-teststomach':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 15,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 4000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 105,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 4000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 5,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 95,
      "roll": 120,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 75,
      "hold": 3000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 165,
      "hold": 3000
    }
  ],
  'mrl-thatwasfun':   [
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 85,
        "lift": 106,
        "rotate": 90,
        "elbow": 25,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 87,
        "lift": 107,
        "rotate": 90,
        "elbow": 32,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 145
      },
      "leftHand": {
        "thumb": 110,
        "index": 62,
        "middle": 56,
        "ring": 88,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 27
      },
      "rightHand": {
        "thumb": 78,
        "index": 88,
        "middle": 101,
        "ring": 95,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-tiltHeadLeftSide':   [
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 76,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    }
  ],
  'mrl-travel':   [
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 90,
        "rotate": 90,
        "elbow": 19,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 90,
        "rotate": 90,
        "elbow": 19,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 54,
        "rotate": 90,
        "elbow": 19,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 54,
        "rotate": 90,
        "elbow": 19,
        "wrist": 12
      }
    }
  ],
  'mrl-unhappy':   [
    {
      "hneck": 85,
      "eye": 40,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 79,
        "lift": 42,
        "rotate": 90,
        "elbow": 23,
        "wrist": 41
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 71,
        "lift": 40,
        "rotate": 90,
        "elbow": 14,
        "wrist": 39
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 47
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 99,
        "index": 130,
        "middle": 152,
        "ring": 154,
        "pinky": 145
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-uselefthand':   [
    {
      "hneck": 10,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 64,
        "lift": 52,
        "rotate": 90,
        "elbow": 59,
        "wrist": 23
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 75,
        "lift": 61,
        "rotate": 90,
        "elbow": 50,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 0
      },
      "leftHand": {
        "thumb": 130,
        "index": 0,
        "middle": 40,
        "ring": 10,
        "pinky": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 11
      },
      "rightHand": {
        "thumb": 180,
        "index": 140,
        "middle": 145,
        "ring": 3,
        "pinky": 0
      }
    }
  ],
  'mrl-welcome':   [
    {
      "hneck": 80,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 26,
        "lift": 105,
        "rotate": 90,
        "elbow": 30,
        "wrist": 25
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 37,
        "lift": 124,
        "rotate": 90,
        "elbow": 30,
        "wrist": 27
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    }
  ],
  'mrl-welcomeToDance1':   [
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 164,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 114,
      "hold": 1000
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 103,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 55,
      "tilt": 53,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 80,
      "eye": 60,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 126,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 26,
        "lift": 105,
        "rotate": 90,
        "elbow": 30,
        "wrist": 25
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 37,
        "lift": 124,
        "rotate": 90,
        "elbow": 30,
        "wrist": 27
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 62,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 114,
      "hold": 400
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 81,
      "hold": 2000
    },
    {
      "hneck": 90,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 81,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 70,
      "tilt": 48,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 60,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 137,
      "hold": 400
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 84,
        "rotate": 90,
        "elbow": 28,
        "wrist": 12
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 37,
        "lift": 124,
        "rotate": 90,
        "elbow": 30,
        "wrist": 27
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 25
      },
      "leftHand": {
        "thumb": 92,
        "index": 33,
        "middle": 37,
        "ring": 71,
        "pinky": 66
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "rightHand": {
        "thumb": 2,
        "index": 2,
        "middle": 2,
        "ring": 2,
        "pinky": 2
      }
    },
    {
      "hneck": 90,
      "eye": 70,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 81,
      "hold": 1000
    }
  ],
  'mrl-whataboutstarwars':   [
    {
      "hneck": 130,
      "eye": 149,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 122,
      "hold": 3000
    },
    {
      "hneck": 155,
      "eye": 31,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 122,
      "hold": 1000
    },
    {
      "hneck": 130,
      "eye": 31,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 122,
      "hold": 1000
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 122,
      "hold": 1000
    },
    {
      "hneck": 90,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 122,
      "hold": 500
    },
    {
      "hneck": 138,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 79,
        "lift": 42,
        "rotate": 90,
        "elbow": 23,
        "wrist": 41
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 71,
        "lift": 40,
        "rotate": 90,
        "elbow": 14,
        "wrist": 39
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 47
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 99,
        "index": 130,
        "middle": 152,
        "ring": 154,
        "pinky": 145
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 116,
      "eye": 80,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 85,
        "lift": 93,
        "rotate": 90,
        "elbow": 42,
        "wrist": 16
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 87,
        "lift": 93,
        "rotate": 90,
        "elbow": 37,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 143
      },
      "leftHand": {
        "thumb": 124,
        "index": 82,
        "middle": 65,
        "ring": 81,
        "pinky": 41
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 21
      },
      "rightHand": {
        "thumb": 59,
        "index": 53,
        "middle": 89,
        "ring": 61,
        "pinky": 36
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    },
    {
      "hneck": 80,
      "eye": 86,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 5,
        "lift": 94,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 7,
        "lift": 74,
        "rotate": 90,
        "elbow": 50,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 90
      },
      "leftHand": {
        "thumb": 180,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 180
      },
      "rightHand": {
        "thumb": 180,
        "index": 2,
        "middle": 175,
        "ring": 160,
        "pinky": 165
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
  'mrl-whatisthecolor':   [
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 43,
        "lift": 88,
        "rotate": 90,
        "elbow": 22,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 20,
        "lift": 90,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "leftHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "rightHand": {
        "thumb": 0,
        "index": 0,
        "middle": 0,
        "ring": 0,
        "pinky": 0
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000,
      "leftArm": {
        "shoulder": 30,
        "lift": 83,
        "rotate": 90,
        "elbow": 22,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 40,
        "lift": 85,
        "rotate": 90,
        "elbow": 30,
        "wrist": 10
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "leftHand": {
        "thumb": 130,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 119
      },
      "rightHand": {
        "thumb": 130,
        "index": 180,
        "middle": 180,
        "ring": 180,
        "pinky": 180
      }
    },
    {
      "hneck": 80,
      "eye": 66,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 2000
    },
    {
      "hneck": 80,
      "eye": 110,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 80,
      "eye": 66,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 80,
      "eye": 110,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 80,
      "eye": 66,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 1000,
      "leftArm": {
        "shoulder": 85,
        "lift": 106,
        "rotate": 90,
        "elbow": 25,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 87,
        "lift": 107,
        "rotate": 90,
        "elbow": 32,
        "wrist": 18
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "leftArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 145
      },
      "leftHand": {
        "thumb": 110,
        "index": 62,
        "middle": 56,
        "ring": 88,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400,
      "rightArm": {
        "shoulder": 90,
        "lift": 45,
        "rotate": 90,
        "elbow": 90,
        "wrist": 27
      },
      "rightHand": {
        "thumb": 78,
        "index": 88,
        "middle": 101,
        "ring": 95,
        "pinky": 81
      }
    },
    {
      "hneck": 85,
      "eye": 90,
      "jaw": 8,
      "rot": 60,
      "tilt": 50,
      "roll": 120,
      "hold": 400
    }
  ],
};

export const MRL_PRESET_META: MrlPresetMeta[] = [
  { id: 'mrl-Yes', name: "Yes", desc: "From MRL InMoov2/Yes.py", icon: "\u25ce", category: 'head', mrlName: "Yes" },
  { id: 'mrl-No', name: "No", desc: "From MRL InMoov2/No.py", icon: "\u25ce", category: 'head', mrlName: "No" },
  { id: 'mrl-lookleftside', name: "Lookleftside", desc: "From MRL InMoov2/lookleftside.py", icon: "\u25ce", category: 'head', mrlName: "lookleftside" },
  { id: 'mrl-lookrightside', name: "Lookrightside", desc: "From MRL InMoov2/lookrightside.py", icon: "\u25ce", category: 'head', mrlName: "lookrightside" },
  { id: 'mrl-lookup', name: "Lookup", desc: "From MRL InMoov2/lookup.py", icon: "\u25ce", category: 'head', mrlName: "lookup" },
  { id: 'mrl-lookdown', name: "Lookdown", desc: "From MRL InMoov2/lookdown.py", icon: "\u25ce", category: 'head', mrlName: "lookdown" },
  { id: 'mrl-tiltHeadAgree', name: "Tilt Head Agree", desc: "From MRL InMoov2/tiltHeadAgree.py", icon: "\u25ce", category: 'head', mrlName: "tiltHeadAgree" },
  { id: 'mrl-tiltHeadRightSide', name: "Tilt Head Right Side", desc: "From MRL InMoov2/tiltHeadRightSide.py", icon: "\u25ce", category: 'head', mrlName: "tiltHeadRightSide" },
  { id: 'mrl-raiserightarm', name: "Raiserightarm", desc: "From MRL InMoov2/raiserightarm.py", icon: "\ud83e\udd16", category: 'full', mrlName: "raiserightarm" },
  { id: 'mrl-raiseleftarm', name: "Raiseleftarm", desc: "From MRL InMoov2/raiseleftarm.py", icon: "\ud83e\udd16", category: 'full', mrlName: "raiseleftarm" },
  { id: 'mrl-shakehand', name: "Shakehand", desc: "From MRL InMoov2/shakehand.py", icon: "\ud83e\udd16", category: 'full', mrlName: "shakehand" },
  { id: 'mrl-victory', name: "Victory", desc: "From MRL InMoov2/victory.py", icon: "\ud83e\udd16", category: 'full', mrlName: "victory" },
  { id: 'mrl-shrug', name: "Shrug", desc: "From MRL InMoov2/shrug.py", icon: "\ud83e\udd16", category: 'full', mrlName: "shrug" },
  { id: 'mrl-presentation', name: "Presentation", desc: "From MRL InMoov2/presentation.py", icon: "\ud83d\udcaa", category: 'arm', mrlName: "presentation" },
  { id: 'mrl-giving', name: "Giving", desc: "From MRL InMoov2/giving.py", icon: "\ud83e\udd16", category: 'full', mrlName: "giving" },
  { id: 'mrl-comehere', name: "Comehere", desc: "From MRL InMoov2/comehere.py", icon: "\ud83e\udd16", category: 'full', mrlName: "comehere" },
  { id: 'mrl-agreeanswersmall', name: "Agreeanswersmall", desc: "From MRL InMoov2/agreeanswersmall.py", icon: "\ud83e\udd16", category: 'full', mrlName: "agreeanswersmall" },
  { id: 'mrl-fistHips', name: "Fist Hips", desc: "From MRL InMoov2/fistHips.py", icon: "\ud83e\udd16", category: 'full', mrlName: "fistHips" },
  { id: 'mrl-armsUp', name: "Arms Up", desc: "From MRL InMoov2/armsUp.py", icon: "\ud83e\udd16", category: 'full', mrlName: "armsUp" },
  { id: 'mrl-surrender', name: "Surrender", desc: "From MRL InMoov2/surrender.py", icon: "\ud83e\udd16", category: 'full', mrlName: "surrender" },
  { id: 'mrl-muscle', name: "Muscle", desc: "From MRL InMoov2/muscle.py", icon: "\ud83e\udd16", category: 'full', mrlName: "muscle" },
  { id: 'mrl-relax', name: "Relax", desc: "From MRL InMoov2/relax.py", icon: "\ud83e\udd16", category: 'full', mrlName: "relax" },
  { id: 'mrl-CloseBothHandSlow', name: "Close Both Hand Slow", desc: "From MRL InMoov2/CloseBothHandSlow.py", icon: "\ud83e\udd16", category: 'full', mrlName: "CloseBothHandSlow" },
  { id: 'mrl-LookAtTheSky', name: "Look At The Sky", desc: "From MRL InMoov2/LookAtTheSky.py", icon: "\u25ce", category: 'head', mrlName: "LookAtTheSky" },
  { id: 'mrl-Torso', name: "Torso", desc: "From MRL InMoov2/Torso.py", icon: "\u25ce", category: 'head', mrlName: "Torso" },
  { id: 'mrl-YesName', name: "Yes Name", desc: "From MRL InMoov2/YesName.py", icon: "\u25ce", category: 'head', mrlName: "YesName" },
  { id: 'mrl-about', name: "About", desc: "From MRL InMoov2/about.py", icon: "\ud83d\udcaa", category: 'arm', mrlName: "about" },
  { id: 'mrl-agreeanswer', name: "Agreeanswer", desc: "From MRL InMoov2/agreeanswer.py", icon: "\ud83e\udd16", category: 'full', mrlName: "agreeanswer" },
  { id: 'mrl-alessandro', name: "Alessandro", desc: "From MRL InMoov2/alessandro.py", icon: "\ud83e\udd16", category: 'full', mrlName: "alessandro" },
  { id: 'mrl-approach', name: "Approach", desc: "From MRL InMoov2/approach.py", icon: "\ud83e\udd16", category: 'full', mrlName: "approach" },
  { id: 'mrl-approachlefthand', name: "Approachlefthand", desc: "From MRL InMoov2/approachlefthand.py", icon: "\ud83e\udd16", category: 'full', mrlName: "approachlefthand" },
  { id: 'mrl-areyoualright', name: "Areyoualright", desc: "From MRL InMoov2/areyoualright.py", icon: "\ud83e\udd16", category: 'full', mrlName: "areyoualright" },
  { id: 'mrl-armLeftSide', name: "Arm Left Side", desc: "From MRL InMoov2/armLeftSide.py", icon: "\ud83d\udcaa", category: 'arm', mrlName: "armLeftSide" },
  { id: 'mrl-armRightSide', name: "Arm Right Side", desc: "From MRL InMoov2/armRightSide.py", icon: "\ud83d\udcaa", category: 'arm', mrlName: "armRightSide" },
  { id: 'mrl-armsFront', name: "Arms Front", desc: "From MRL InMoov2/armsFront.py", icon: "\ud83e\udd16", category: 'full', mrlName: "armsFront" },
  { id: 'mrl-balance', name: "Balance", desc: "From MRL InMoov2/balance.py", icon: "\ud83e\udd16", category: 'full', mrlName: "balance" },
  { id: 'mrl-beforehappy', name: "Beforehappy", desc: "From MRL InMoov2/beforehappy.py", icon: "\ud83e\udd16", category: 'full', mrlName: "beforehappy" },
  { id: 'mrl-bookcat', name: "Bookcat", desc: "From MRL InMoov2/bookcat.py", icon: "\u25ce", category: 'head', mrlName: "bookcat" },
  { id: 'mrl-brake', name: "Brake", desc: "From MRL InMoov2/brake.py", icon: "\ud83e\udd16", category: 'full', mrlName: "brake" },
  { id: 'mrl-call_911', name: "Call 911", desc: "From MRL InMoov2/call_911.py", icon: "\ud83e\udd16", category: 'full', mrlName: "call_911" },
  { id: 'mrl-canyougivemethetime', name: "Canyougivemethetime", desc: "From MRL InMoov2/canyougivemethetime.py", icon: "\ud83e\udd16", category: 'full', mrlName: "canyougivemethetime" },
  { id: 'mrl-carrybaby', name: "Carrybaby", desc: "From MRL InMoov2/carrybaby.py", icon: "\ud83e\udd16", category: 'full', mrlName: "carrybaby" },
  { id: 'mrl-catchBall', name: "Catch Ball", desc: "From MRL InMoov2/catchBall.py", icon: "\ud83e\udd16", category: 'full', mrlName: "catchBall" },
  { id: 'mrl-catchBallLeft', name: "Catch Ball Left", desc: "From MRL InMoov2/catchBallLeft.py", icon: "\ud83e\udd16", category: 'full', mrlName: "catchBallLeft" },
  { id: 'mrl-catchBallRight', name: "Catch Ball Right", desc: "From MRL InMoov2/catchBallRight.py", icon: "\ud83e\udd16", category: 'full', mrlName: "catchBallRight" },
  { id: 'mrl-christmasCarols', name: "Christmas Carols", desc: "From MRL InMoov2/christmasCarols.py", icon: "\ud83e\udd16", category: 'full', mrlName: "christmasCarols" },
  { id: 'mrl-closelefthand', name: "Closelefthand", desc: "From MRL InMoov2/closelefthand.py", icon: "\u270b", category: 'hand', mrlName: "closelefthand" },
  { id: 'mrl-closerighthand', name: "Closerighthand", desc: "From MRL InMoov2/closerighthand.py", icon: "\u270b", category: 'hand', mrlName: "closerighthand" },
  { id: 'mrl-cyclegesture3', name: "Cyclegesture3", desc: "From MRL InMoov2/cyclegesture3.py", icon: "\ud83e\udd16", category: 'full', mrlName: "cyclegesture3" },
  { id: 'mrl-daVinci', name: "Da Vinci", desc: "From MRL InMoov2/daVinci.py", icon: "\ud83e\udd16", category: 'full', mrlName: "daVinci" },
  { id: 'mrl-delicategrab', name: "Delicategrab", desc: "From MRL InMoov2/delicategrab.py", icon: "\ud83e\udd16", category: 'full', mrlName: "delicategrab" },
  { id: 'mrl-dontworry', name: "Dontworry", desc: "From MRL InMoov2/dontworry.py", icon: "\ud83e\udd16", category: 'full', mrlName: "dontworry" },
  { id: 'mrl-dropit', name: "Dropit", desc: "From MRL InMoov2/dropit.py", icon: "\ud83e\udd16", category: 'full', mrlName: "dropit" },
  { id: 'mrl-eatindianfood', name: "Eatindianfood", desc: "From MRL InMoov2/eatindianfood.py", icon: "\ud83e\udd16", category: 'full', mrlName: "eatindianfood" },
  { id: 'mrl-explaining', name: "Explaining", desc: "From MRL InMoov2/explaining.py", icon: "\u25ce", category: 'head', mrlName: "explaining" },
  { id: 'mrl-faceMove', name: "Face Move", desc: "From MRL InMoov2/faceMove.py", icon: "\ud83e\udd16", category: 'full', mrlName: "faceMove" },
  { id: 'mrl-fighter', name: "Fighter", desc: "From MRL InMoov2/fighter.py", icon: "\ud83e\udd16", category: 'full', mrlName: "fighter" },
  { id: 'mrl-fingerleft', name: "Fingerleft", desc: "From MRL InMoov2/fingerleft.py", icon: "\ud83e\udd16", category: 'full', mrlName: "fingerleft" },
  { id: 'mrl-fingerright', name: "Fingerright", desc: "From MRL InMoov2/fingerright.py", icon: "\ud83e\udd16", category: 'full', mrlName: "fingerright" },
  { id: 'mrl-finnishhello', name: "Finnishhello", desc: "From MRL InMoov2/finnishhello.py", icon: "\ud83e\udd16", category: 'full', mrlName: "finnishhello" },
  { id: 'mrl-gestureforlondon3', name: "Gestureforlondon3", desc: "From MRL InMoov2/gestureforlondon3.py", icon: "\ud83e\udd16", category: 'full', mrlName: "gestureforlondon3" },
  { id: 'mrl-gestureforlondon4', name: "Gestureforlondon4", desc: "From MRL InMoov2/gestureforlondon4.py", icon: "\ud83e\udd16", category: 'full', mrlName: "gestureforlondon4" },
  { id: 'mrl-getball', name: "Getball", desc: "From MRL InMoov2/getball.py", icon: "\ud83e\udd16", category: 'full', mrlName: "getball" },
  { id: 'mrl-givethebottle', name: "Givethebottle", desc: "From MRL InMoov2/givethebottle.py", icon: "\ud83e\udd16", category: 'full', mrlName: "givethebottle" },
  { id: 'mrl-givetheglass', name: "Givetheglass", desc: "From MRL InMoov2/givetheglass.py", icon: "\ud83e\udd16", category: 'full', mrlName: "givetheglass" },
  { id: 'mrl-grabthebottle', name: "Grabthebottle", desc: "From MRL InMoov2/grabthebottle.py", icon: "\ud83e\udd16", category: 'full', mrlName: "grabthebottle" },
  { id: 'mrl-grabtheglass', name: "Grabtheglass", desc: "From MRL InMoov2/grabtheglass.py", icon: "\ud83e\udd16", category: 'full', mrlName: "grabtheglass" },
  { id: 'mrl-handclose', name: "Handclose", desc: "From MRL InMoov2/handclose.py", icon: "\u270b", category: 'hand', mrlName: "handclose" },
  { id: 'mrl-handdown', name: "Handdown", desc: "From MRL InMoov2/handdown.py", icon: "\ud83e\udd16", category: 'full', mrlName: "handdown" },
  { id: 'mrl-handopen', name: "Handopen", desc: "From MRL InMoov2/handopen.py", icon: "\u270b", category: 'hand', mrlName: "handopen" },
  { id: 'mrl-handsclose', name: "Handsclose", desc: "From MRL InMoov2/handsclose.py", icon: "\u270b", category: 'hand', mrlName: "handsclose" },
  { id: 'mrl-handsopen', name: "Handsopen", desc: "From MRL InMoov2/handsopen.py", icon: "\u270b", category: 'hand', mrlName: "handsopen" },
  { id: 'mrl-happy_1', name: "Happy 1", desc: "From MRL InMoov2/happy_1.py", icon: "\ud83e\udd16", category: 'full', mrlName: "happy_1" },
  { id: 'mrl-heard', name: "Heard", desc: "From MRL InMoov2/heard.py", icon: "\ud83e\udd16", category: 'full', mrlName: "heard" },
  { id: 'mrl-hello', name: "Hello", desc: "From MRL InMoov2/hello.py", icon: "\ud83e\udd16", category: 'full', mrlName: "hello" },
  { id: 'mrl-hi', name: "Hi", desc: "From MRL InMoov2/hi.py", icon: "\ud83e\udd16", category: 'full', mrlName: "hi" },
  { id: 'mrl-howdoyoudo', name: "Howdoyoudo", desc: "From MRL InMoov2/howdoyoudo.py", icon: "\ud83e\udd16", category: 'full', mrlName: "howdoyoudo" },
  { id: 'mrl-howmanyfingersdoihave', name: "Howmanyfingersdoihave", desc: "From MRL InMoov2/howmanyfingersdoihave.py", icon: "\ud83e\udd16", category: 'full', mrlName: "howmanyfingersdoihave" },
  { id: 'mrl-iloveyou', name: "Iloveyou", desc: "From MRL InMoov2/iloveyou.py", icon: "\ud83e\udd16", category: 'full', mrlName: "iloveyou" },
  { id: 'mrl-isitaball', name: "Isitaball", desc: "From MRL InMoov2/isitaball.py", icon: "\ud83e\udd16", category: 'full', mrlName: "isitaball" },
  { id: 'mrl-italianhello', name: "Italianhello", desc: "From MRL InMoov2/italianhello.py", icon: "\ud83e\udd16", category: 'full', mrlName: "italianhello" },
  { id: 'mrl-juggle', name: "Juggle", desc: "From MRL InMoov2/juggle.py", icon: "\ud83e\udd16", category: 'full', mrlName: "juggle" },
  { id: 'mrl-juggle2', name: "Juggle2", desc: "From MRL InMoov2/juggle2.py", icon: "\ud83e\udd16", category: 'full', mrlName: "juggle2" },
  { id: 'mrl-juggleCloseHand', name: "Juggle Close Hand", desc: "From MRL InMoov2/juggleCloseHand.py", icon: "\ud83e\udd16", category: 'full', mrlName: "juggleCloseHand" },
  { id: 'mrl-keepball', name: "Keepball", desc: "From MRL InMoov2/keepball.py", icon: "\ud83e\udd16", category: 'full', mrlName: "keepball" },
  { id: 'mrl-lookAtThis', name: "Look At This", desc: "From MRL InMoov2/lookAtThis.py", icon: "\ud83e\udd16", category: 'full', mrlName: "lookAtThis" },
  { id: 'mrl-madeby', name: "Madeby", desc: "From MRL InMoov2/madeby.py", icon: "\ud83e\udd16", category: 'full', mrlName: "madeby" },
  { id: 'mrl-madebyfrench', name: "Madebyfrench", desc: "From MRL InMoov2/madebyfrench.py", icon: "\ud83e\udd16", category: 'full', mrlName: "madebyfrench" },
  { id: 'mrl-missedYou', name: "Missed You", desc: "From MRL InMoov2/missedYou.py", icon: "\ud83e\udd16", category: 'full', mrlName: "missedYou" },
  { id: 'mrl-more', name: "More", desc: "From MRL InMoov2/more.py", icon: "\ud83e\udd16", category: 'full', mrlName: "more" },
  { id: 'mrl-negative', name: "Negative", desc: "From MRL InMoov2/negative.py", icon: "\ud83e\udd16", category: 'full', mrlName: "negative" },
  { id: 'mrl-newyork', name: "Newyork", desc: "From MRL InMoov2/newyork.py", icon: "\ud83e\udd16", category: 'full', mrlName: "newyork" },
  { id: 'mrl-notTrue', name: "Not True", desc: "From MRL InMoov2/notTrue.py", icon: "\ud83e\udd16", category: 'full', mrlName: "notTrue" },
  { id: 'mrl-oneFinger', name: "One Finger", desc: "From MRL InMoov2/oneFinger.py", icon: "\ud83e\udd16", category: 'full', mrlName: "oneFinger" },
  { id: 'mrl-openlefthand', name: "Openlefthand", desc: "From MRL InMoov2/openlefthand.py", icon: "\u270b", category: 'hand', mrlName: "openlefthand" },
  { id: 'mrl-openrighthand', name: "Openrighthand", desc: "From MRL InMoov2/openrighthand.py", icon: "\u270b", category: 'hand', mrlName: "openrighthand" },
  { id: 'mrl-passiveanswer', name: "Passiveanswer", desc: "From MRL InMoov2/passiveanswer.py", icon: "\ud83e\udd16", category: 'full', mrlName: "passiveanswer" },
  { id: 'mrl-perfect', name: "Perfect", desc: "From MRL InMoov2/perfect.py", icon: "\ud83e\udd16", category: 'full', mrlName: "perfect" },
  { id: 'mrl-phonehome', name: "Phonehome", desc: "From MRL InMoov2/phonehome.py", icon: "\ud83e\udd16", category: 'full', mrlName: "phonehome" },
  { id: 'mrl-photo', name: "Photo", desc: "From MRL InMoov2/photo.py", icon: "\ud83e\udd16", category: 'full', mrlName: "photo" },
  { id: 'mrl-picturebothside', name: "Picturebothside", desc: "From MRL InMoov2/picturebothside.py", icon: "\ud83e\udd16", category: 'full', mrlName: "picturebothside" },
  { id: 'mrl-pictureleftside', name: "Pictureleftside", desc: "From MRL InMoov2/pictureleftside.py", icon: "\ud83e\udd16", category: 'full', mrlName: "pictureleftside" },
  { id: 'mrl-picturerightside', name: "Picturerightside", desc: "From MRL InMoov2/picturerightside.py", icon: "\ud83e\udd16", category: 'full', mrlName: "picturerightside" },
  { id: 'mrl-playsong', name: "Playsong", desc: "From MRL InMoov2/playsong.py", icon: "\u25ce", category: 'head', mrlName: "playsong" },
  { id: 'mrl-poorbottle', name: "Poorbottle", desc: "From MRL InMoov2/poorbottle.py", icon: "\ud83e\udd16", category: 'full', mrlName: "poorbottle" },
  { id: 'mrl-putitdown', name: "Putitdown", desc: "From MRL InMoov2/putitdown.py", icon: "\ud83e\udd16", category: 'full', mrlName: "putitdown" },
  { id: 'mrl-ready', name: "Ready", desc: "From MRL InMoov2/ready.py", icon: "\ud83e\udd16", category: 'full', mrlName: "ready" },
  { id: 'mrl-releasedelicate', name: "Releasedelicate", desc: "From MRL InMoov2/releasedelicate.py", icon: "\ud83e\udd16", category: 'full', mrlName: "releasedelicate" },
  { id: 'mrl-releaseleftclothes', name: "Releaseleftclothes", desc: "From MRL InMoov2/releaseleftclothes.py", icon: "\ud83e\udd16", category: 'full', mrlName: "releaseleftclothes" },
  { id: 'mrl-removeleftarm', name: "Removeleftarm", desc: "From MRL InMoov2/removeleftarm.py", icon: "\ud83e\udd16", category: 'full', mrlName: "removeleftarm" },
  { id: 'mrl-rightbicepsraise', name: "Rightbicepsraise", desc: "From MRL InMoov2/rightbicepsraise.py", icon: "\ud83d\udcaa", category: 'arm', mrlName: "rightbicepsraise" },
  { id: 'mrl-rightclothes', name: "Rightclothes", desc: "From MRL InMoov2/rightclothes.py", icon: "\ud83e\udd16", category: 'full', mrlName: "rightclothes" },
  { id: 'mrl-rollHead', name: "Roll Head", desc: "From MRL InMoov2/rollHead.py", icon: "\u25ce", category: 'head', mrlName: "rollHead" },
  { id: 'mrl-servos', name: "Servos", desc: "From MRL InMoov2/servos.py", icon: "\ud83e\udd16", category: 'full', mrlName: "servos" },
  { id: 'mrl-showObject', name: "Show Object", desc: "From MRL InMoov2/showObject.py", icon: "\ud83e\udd16", category: 'full', mrlName: "showObject" },
  { id: 'mrl-signature', name: "Signature", desc: "From MRL InMoov2/signature.py", icon: "\ud83e\udd16", category: 'full', mrlName: "signature" },
  { id: 'mrl-sing', name: "Sing", desc: "From MRL InMoov2/sing.py", icon: "\ud83e\udd16", category: 'full', mrlName: "sing" },
  { id: 'mrl-slowlycloselefthand', name: "Slowlycloselefthand", desc: "From MRL InMoov2/slowlycloselefthand.py", icon: "\ud83e\udd16", category: 'full', mrlName: "slowlycloselefthand" },
  { id: 'mrl-slowlycloserighthand', name: "Slowlycloserighthand", desc: "From MRL InMoov2/slowlycloserighthand.py", icon: "\ud83e\udd16", category: 'full', mrlName: "slowlycloserighthand" },
  { id: 'mrl-speakhindi', name: "Speakhindi", desc: "From MRL InMoov2/speakhindi.py", icon: "\ud83e\udd16", category: 'full', mrlName: "speakhindi" },
  { id: 'mrl-stopTravel', name: "Stop Travel", desc: "From MRL InMoov2/stopTravel.py", icon: "\ud83e\udd16", category: 'full', mrlName: "stopTravel" },
  { id: 'mrl-story', name: "Story", desc: "From MRL InMoov2/story.py", icon: "\ud83e\udd16", category: 'full', mrlName: "story" },
  { id: 'mrl-studyball', name: "Studyball", desc: "From MRL InMoov2/studyball.py", icon: "\ud83e\udd16", category: 'full', mrlName: "studyball" },
  { id: 'mrl-systemcheck', name: "Systemcheck", desc: "From MRL InMoov2/systemcheck.py", icon: "\ud83e\udd16", category: 'full', mrlName: "systemcheck" },
  { id: 'mrl-takeball', name: "Takeball", desc: "From MRL InMoov2/takeball.py", icon: "\ud83e\udd16", category: 'full', mrlName: "takeball" },
  { id: 'mrl-takethis', name: "Takethis", desc: "From MRL InMoov2/takethis.py", icon: "\ud83e\udd16", category: 'full', mrlName: "takethis" },
  { id: 'mrl-teststomach', name: "Teststomach", desc: "From MRL InMoov2/teststomach.py", icon: "\u25ce", category: 'head', mrlName: "teststomach" },
  { id: 'mrl-thatwasfun', name: "Thatwasfun", desc: "From MRL InMoov2/thatwasfun.py", icon: "\ud83e\udd16", category: 'full', mrlName: "thatwasfun" },
  { id: 'mrl-tiltHeadLeftSide', name: "Tilt Head Left Side", desc: "From MRL InMoov2/tiltHeadLeftSide.py", icon: "\u25ce", category: 'head', mrlName: "tiltHeadLeftSide" },
  { id: 'mrl-travel', name: "Travel", desc: "From MRL InMoov2/travel.py", icon: "\ud83e\udd16", category: 'full', mrlName: "travel" },
  { id: 'mrl-unhappy', name: "Unhappy", desc: "From MRL InMoov2/unhappy.py", icon: "\ud83e\udd16", category: 'full', mrlName: "unhappy" },
  { id: 'mrl-uselefthand', name: "Uselefthand", desc: "From MRL InMoov2/uselefthand.py", icon: "\ud83e\udd16", category: 'full', mrlName: "uselefthand" },
  { id: 'mrl-welcome', name: "Welcome", desc: "From MRL InMoov2/welcome.py", icon: "\ud83e\udd16", category: 'full', mrlName: "welcome" },
  { id: 'mrl-welcomeToDance1', name: "Welcome To Dance1", desc: "From MRL InMoov2/welcomeToDance1.py", icon: "\ud83e\udd16", category: 'full', mrlName: "welcomeToDance1" },
  { id: 'mrl-whataboutstarwars', name: "Whataboutstarwars", desc: "From MRL InMoov2/whataboutstarwars.py", icon: "\ud83e\udd16", category: 'full', mrlName: "whataboutstarwars" },
  { id: 'mrl-whatisthecolor', name: "Whatisthecolor", desc: "From MRL InMoov2/whatisthecolor.py", icon: "\ud83e\udd16", category: 'full', mrlName: "whatisthecolor" },
];
